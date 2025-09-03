import React from 'react';
import { create } from 'zustand';
import { useTMAClient } from './TMAClientContext';
import { update } from '../utils';

export enum Status {
  Loading,
  Authenticated,
  Unauthenticated,
  Forbidden,
}

export interface TMAStoreContextState {
  query: (path: string | string[]) => Promise<unknown>;
  mutate: (action: string, payload: unknown) => Promise<unknown>;
  loadingRef: React.RefObject<string[]>;
}

export const TMAStoreContext = React.createContext<TMAStoreContextState | undefined>(undefined);

export interface TMAStoreProviderProps extends React.PropsWithChildren {
}

export interface ResponseDataCommand {
  update?: string[];
  action?: string;
  payload: unknown;
}

export interface ResponseData {
  commands: ResponseDataCommand[];
}

export type Store = {
  status: Status,
  state: Record<string, unknown>,
  loading: string[],
  update: (commands: ResponseDataCommand | ResponseDataCommand[]) => void,
}

export const useTMAStore = create<Store>((set) => ({
  status: Status.Loading,
  state: {},
  loading: [],
  update: (commands: ResponseDataCommand |ResponseDataCommand[]) => {
    set((store) => {
      commands = Array.isArray(commands) ? commands : [commands];

      for (const command of commands) {
        if (typeof command.payload === 'function') {
          store = command.payload(store);
        } else {
          store = {
            ...store,
            state: update(store.state, command.update, command.payload),
          };
        }
      }

      return store;
    });
  }
}));

export function TMAStoreProvider({ children }: TMAStoreProviderProps) {
  const client = useTMAClient();
  const { update } = useTMAStore();
  const loadingRef = React.useRef([]);

  const query = React.useCallback((path: string | string[]) => {
    const key = JSON.stringify(path);

    loadingRef.current.push(key);

    update({
      update: ['loading'],
      payload: (store: Store) => ({
        ...store,
        loading: [...store.loading, key],
      }),
    });

    return client.query(path)
      .then((res: ResponseData) => {
        loadingRef.current = loadingRef.current.filter((k) => k !== key);

        update([
          ...res.commands,
          {
            update: ['loading'],
            payload: (store: Store) => ({
              ...store,
              loading: store.loading.filter((k) => k !== key),
            }),
          }
        ]);

        return res;
      })
      .catch(() => {
        loadingRef.current = loadingRef.current.filter((k) => k !== key);

        update({
          update: ['loading'],
          payload: (store: Store) => ({
            ...store,
            loading: store.loading.filter((k) => k !== key),
          }),
        });
      });
  }, [client.query]);

  const mutate = React.useCallback((action: string, payload?: unknown) => {
    const key = JSON.stringify({ action, payload });

    update({
      update: ['loading'],
      payload: (store: Store) => ({
        ...store,
        loading: [...store.loading, key],
      }),
    });

    return client.mutate(action, payload)
      .then((res: ResponseData) => {
        update(res.commands);

        return res;
      })
  }, [client.mutate]);

  React.useEffect(() => {
    mutate('init')
      .then(() => {
        update({
          update: ['status'],
          payload: Status.Authenticated,
        });
      })
      .catch((error) => {
        console.error(error);
        update({
          update: ['status'],
          payload: Status.Forbidden,
        });
      });
  }, [mutate]);

  const value = React.useMemo(() => ({
    query,
    mutate,
    loadingRef,
  }), [query, mutate, loadingRef]);

  return (
    <TMAStoreContext.Provider value={value}>
      {children}
    </TMAStoreContext.Provider>
  );
}

export function useTMAStoreQuery() {
  const context = React.use(TMAStoreContext);

  if (!context) {
    throw new Error('useTMA must be used within a TMAStoreProvider');
  }

  return {
    query: context.query,
    loadingRef: context.loadingRef,
  };
}

export function useTMAStoreMutate() {
  const context = React.use(TMAStoreContext);

  if (!context) {
    throw new Error('useTMA must be used within a TMAStoreProvider');
  }

  return context.mutate;
}
