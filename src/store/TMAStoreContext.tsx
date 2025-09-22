import {
  RefObject,
  createContext,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { create } from 'zustand';
import { update, merge, get } from '@ywwwtseng/ywjs';
import { ToastContainer } from 'react-toastify';
import { useTMAClient } from './TMAClientContext';
import { Status } from '../constants';

export interface TMAStoreContextState {
  query: (
    path: string | string[],
    params: Record<string, string | number | boolean>
  ) => Promise<unknown>;
  mutate: (
    action: string,
    payload: unknown,
    options?: MutateOptions
  ) => Promise<unknown>;
  loadingRef: RefObject<string[]>;
}

export const TMAStoreContext = createContext<TMAStoreContextState | undefined>(
  undefined
);

export interface TMAStoreProviderProps extends PropsWithChildren {}

export interface Command {
  update?: string | string[];
  merge?: string | string[];
  payload: unknown;
}

export interface MutateOptions {
  optimistic?: {
    execute: Command[];
    undo?: Command[];
  };
}

export interface ResponseData {
  commands?: Command[];
  notify?: {
    type?: 'info' | 'success' | 'warning' | 'error' | 'default';
    message: string;
  };
  ok?: boolean;
}

export interface ResponseError {
  data?: {
    error: string;
  };
}

export type Store = {
  status: Status;
  state: Record<string, unknown>;
  loading: string[];
  update: (commands: Command | Command[]) => void;
};

export const useTMAStore = create<Store>((set) => ({
  status: Status.Loading,
  state: {},
  loading: [],
  update: (commands: Command | Command[]) => {
    set((store) => {
      commands = Array.isArray(commands) ? commands : [commands];

      for (const command of commands) {
        if (typeof command.payload === 'function') {
          store = command.payload(store);
        } else {
          if ('update' in command) {
            store = {
              ...store,
              state: update(store.state, command.update, command.payload),
            };
          } else if ('merge' in command) {
            store = {
              ...store,
              state: update(
                store.state,
                command.merge,
                merge({}, get(store.state, command.merge), command.payload)
              ),
            };
          }
        }
      }

      return store;
    });
  },
}));

export function TMAStoreProvider({ children }: TMAStoreProviderProps) {
  const client = useTMAClient();
  const { update } = useTMAStore();
  const loadingRef = useRef([]);

  const query = useCallback(
    (
      path: string | string[],
      params: Record<string, string | number | boolean> = {}
    ) => {
      const key = JSON.stringify(path);

      loadingRef.current.push(key);

      update({
        update: ['loading'],
        payload: (store: Store) => ({
          ...store,
          loading: [...store.loading, key],
        }),
      });

      return client
        .query(path, params)
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
            },
          ]);

          return res;
        })
        .catch((error) => {
          loadingRef.current = loadingRef.current.filter((k) => k !== key);

          update({
            update: ['loading'],
            payload: (store: Store) => ({
              ...store,
              loading: store.loading.filter((k) => k !== key),
            }),
          });

          throw error;
        });
    },
    [client.query]
  );

  const mutate = useCallback(
    (action: string, payload?: unknown, options?: MutateOptions) => {
      const key = JSON.stringify({ action, payload });

      update({
        update: ['loading'],
        payload: (store: Store) => ({
          ...store,
          loading: [...store.loading, key],
        }),
      });

      const optimistic = options?.optimistic;
      const execute = optimistic?.execute;

      if (execute) {
        update(execute);
      }

      return client
        .mutate(action, payload)
        .then((res: ResponseData) => {
          if (res.commands) {
            update(res.commands);
          }

          return res;
        })
        .catch((error) => {
          const undo = optimistic?.undo;

          if (undo) {
            update(undo);
          }

          throw error;
        });
    },
    [client.mutate]
  );

  useEffect(() => {
    const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();

    mutate('init', {
      timezone: resolvedOptions.timeZone,
      language_code: resolvedOptions.locale,
    })
      .then(() => {
        update({
          update: ['status'],
          payload: (store: Store) => ({
            ...store,
            status: Status.Authenticated,
          }),
        });
      })
      .catch((error) => {
        console.error(error);
        update({
          update: ['status'],
          payload: (store: Store) => ({
            ...store,
            status: Status.Forbidden,
          }),
        });
      });
  }, [mutate]);

  const value = useMemo(
    () => ({
      query,
      mutate,
      loadingRef,
    }),
    [query, mutate, loadingRef]
  );

  return (
    <>
      <TMAStoreContext.Provider value={value}>
        {children}
      </TMAStoreContext.Provider>
      <ToastContainer
        closeOnClick
        theme="dark"
        closeButton={false}
        autoClose={2400}
        hideProgressBar
        position="top-center"
      />
    </>
  );
}
