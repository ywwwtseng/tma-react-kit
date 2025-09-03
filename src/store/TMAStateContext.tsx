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

export interface TMAStateContextState {
  query: (path: string | string[]) => Promise<unknown>;
  mutate: (action: string, payload: unknown) => Promise<unknown>;
}

export const TMAStateContext = React.createContext<TMAStateContextState | undefined>(undefined);

export interface TMAStateProviderProps extends React.PropsWithChildren {
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
  update: (action: ResponseDataCommand) => void,
}

export const useTMAStore = create<Store>((set) => ({
  status: Status.Loading,
  state: {},
  loading: [],
  update: (command: ResponseDataCommand) => {
    set((store) => {
      if (typeof command.payload === 'function') {
        return command.payload(store);
      } else {
        return update(store, command.update, command.payload);
      }
    });
  }
}));

export function TMAStateProvider({ children }: TMAStateProviderProps) {
  const client = useTMAClient();
  const { update } = useTMAStore();

  const query = React.useCallback((path: string | string[]) => {
    const key = JSON.stringify(path);

    update({
      update: ['loading'],
      payload: (store: Store) => ({
        ...store,
        loading: [...store.loading, key],
      }),
    });

    return client.query(path)
      .then((res: ResponseData) => {
        for (const command of res.commands) {
          if (command.update?.[0] === 'state') {
            update(command);
          }
        }

        return res;
      })
      .finally(() => {
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
        for (const command of res.commands) {
          if (command.update?.[0] === 'state') {
            update(command);
          }
        }

        return res;
      })
      .finally(() => {
        update({
          update: ['loading'],
          payload: (store: Store) => ({
            ...store,
            loading: store.loading.filter((k) => k !== key),
          }),
        });
      });
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
  }), [query, mutate]);

  return (
    <TMAStateContext.Provider value={value}>
      {children}
    </TMAStateContext.Provider>
  );
}

export function useTMAState(): TMAStateContextState {
  const context = React.use(TMAStateContext);

  if (!context) {
    throw new Error('useTMA must be used within a TMAStateProvider');
  }

  return context;
}
