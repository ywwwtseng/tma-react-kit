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
import { produce } from 'immer';
import { merge } from '@ywwwtseng/ywjs';
import { ToastContainer } from 'react-toastify';
import { useTMAClient } from './TMAClientContext';
import { Status } from '../constants';

export interface TMAStoreContextState {
  query: (
    path: string,
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
  update?: string;
  merge?: string;
  replace?: string;
  remove?: string;
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
  update: (commands: Command[]) => void;
};

export const useTMAStore = create<Store>((set) => ({
  status: Status.Loading,
  state: {},
  loading: [],
  update: (commands: Command[]) => {
    set((store) => {
      // commands = Array.isArray(commands) ? commands : [commands];
      // for (const command of commands) {
      //   if (typeof command.payload === 'function') {
      //     return command.payload(store);
      //   } else {
      //     if ('update' in command) {
      //       // store = {
      //       //   ...store,
      //       //   state: update(store.state, command.update, command.payload),
      //       // };
      //       return produce(store, (draft) => {
      //         draft.state[command.update] = command.payload;
      //       });
      //     } else if ('merge' in command) {
      //       // store = {
      //       //   ...store,
      //       //   state: update(
      //       //     store.state,
      //       //     command.merge,
      //       //     merge({}, get(store.state, command.merge), command.payload)
      //       //   ),
      //       // };
      //       return produce(store, (draft) => {
      //         draft.state[command.merge] = merge(
      //           draft.state[command.merge],
      //           command.payload
      //         );
      //       });
      //     } else if (
      //       'replace' in command &&
      //       typeof command.payload === 'object' &&
      //       'target' in command.payload &&
      //       'data' in command.payload
      //     ) {
      //       const { target, data } = command.payload;
      //       if (typeof target === 'string' && typeof data === 'object') {
      //         // const prev = [...get(store.state, command.replace)];
      //         // const index = get(store.state, command.replace).findIndex(
      //         //   (item: Record<string, unknown>) => item[target] === data[target]
      //         // );
      //         // if (index !== -1) {
      //         //   prev.push(data);
      //         // } else {
      //         //   prev[index] = data;
      //         // }
      //         // store = {
      //         //   ...store,
      //         //   state: update(
      //         //     store.state,
      //         //     command.replace,
      //         //     get(store.state, command.replace).map(
      //         //       (item: Record<string, unknown>) =>
      //         //         item[target] === data[target] ? data : item
      //         //     )
      //         //   ),
      //         // };
      //         return produce(store, (draft) => {
      //           const state = draft.state[command.replace];

      //           if (Array.isArray(state)) {
      //             const index = state.findIndex(
      //               (item: Record<string, unknown>) =>
      //                 item[target] === data[target]
      //             );

      //             if (index !== -1) {
      //               state[index] = data;
      //             } else {
      //               state.push(data);
      //             }
      //           }
      //         });
      //       }
      //     }
      //   }
      // }

      // return store;

      return produce(store, (draft) => {
        for (const command of commands) {
          if (typeof command.payload === 'function') {
            return command.payload(draft);
          } else {
            if ('update' in command) {
              draft.state[command.update] = command.payload;
            } else if ('merge' in command) {
              draft.state[command.merge] = merge(
                draft.state[command.merge],
                command.payload
              );
            } else if (
              'replace' in command &&
              typeof command.payload === 'object' &&
              'target' in command.payload &&
              'data' in command.payload
            ) {
              const { target, data } = command.payload;
              if (typeof target === 'string' && typeof data === 'object') {
                const state = draft.state[command.replace];

                if (Array.isArray(state)) {
                  const index = state.findIndex(
                    (item: Record<string, unknown>) =>
                      item[target] === data[target]
                  );

                  if (index !== -1) {
                    state[index] = data;
                  } else {
                    state.push(data);
                  }
                }
              }
            }
          }
        }
      });
    });
  },
}));

export function TMAStoreProvider({ children }: TMAStoreProviderProps) {
  const client = useTMAClient();
  const { update } = useTMAStore();
  const loadingRef = useRef([]);

  const query = useCallback(
    (path: string, params: Record<string, string | number | boolean> = {}) => {
      const key = JSON.stringify(path);

      loadingRef.current.push(key);

      update([
        {
          update: 'loading',
          payload: (draft: Store) => {
            draft.loading.push(key);
          },
        },
      ]);

      return client
        .query(path, params)
        .then((res: ResponseData) => {
          loadingRef.current = loadingRef.current.filter((k) => k !== key);

          update([
            ...res.commands,
            {
              update: 'loading',
              payload: (draft: Store) => {
                draft.loading = draft.loading.filter((k) => k !== key);
              },
            },
          ]);

          return res;
        })
        .catch((error) => {
          loadingRef.current = loadingRef.current.filter((k) => k !== key);

          update([
            {
              update: 'loading',
              payload: (draft: Store) => {
                draft.loading = draft.loading.filter((k) => k !== key);
              },
            },
          ]);

          throw error;
        });
    },
    [client.query]
  );

  const mutate = useCallback(
    (action: string, payload?: unknown, options?: MutateOptions) => {
      const key = JSON.stringify({ action, payload });

      update([
        {
          update: 'loading',
          payload: (draft: Store) => {
            draft.loading.push(key);
          },
        },
      ]);

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
        update([
          {
            update: 'status',
            payload: (draft: Store) => {
              draft.status = Status.Authenticated;
            },
          },
        ]);
      })
      .catch((error) => {
        console.error(error);
        update([
          {
            update: 'status',
            payload: (draft: Store) => {
              draft.status = Status.Forbidden;
            },
          },
        ]);
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
