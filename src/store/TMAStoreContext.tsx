import {
  RefObject,
  createContext,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { useNavigate } from '@ywwwtseng/react-kit';
import { create } from 'zustand';
import { produce } from 'immer';
import { merge } from '@ywwwtseng/ywjs';
import { ToastContainer } from 'react-toastify';
import { useTMAClient } from './TMAClientContext';

import { Status } from '../constants';

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface TMAStoreContextState {
  query: (path: string, params: QueryParams) => Promise<unknown>;
  mutate: (
    action: string,
    payload: unknown,
    options?: MutateOptions
  ) => Promise<unknown>;
  update: (commands: Command[]) => void;
  loadingRef: RefObject<string[]>;
}

export const TMAStoreContext = createContext<TMAStoreContextState | undefined>(
  undefined
);

export interface TMAStoreProviderProps extends PropsWithChildren {}

export interface Command {
  type: 'update' | 'merge' | 'replace' | 'unshift';
  target?: string;
  payload: unknown;
}

export interface MutateOptions {
  optimistic?: {
    execute: Command[];
    undo: Command[];
  };
}

export interface ResponseData {
  commands?: Command[];
  notify?: {
    type?: 'info' | 'success' | 'warning' | 'error' | 'default';
    message: string;
  };
  navigate?: {
    screen: string;
    params: Record<string, string | number | boolean>;
  };
  ok: boolean;
}

export type Store = {
  status: Status;
  state: Record<string, unknown>;
  loading: string[];
  update: (commands: Command[]) => void;
};

export const getQueryKey = (path: string, params: QueryParams) => {
  return Object.keys(params).length > 0
    ? JSON.stringify({ path, params })
    : path;
};

export const useTMAStore = create<Store>((set) => ({
  status: Status.Loading,
  state: {},
  loading: [],
  update: (commands: Command[]) => {
    set((store) => {
      return produce(store, (draft) => {
        for (const command of commands) {
          if (
            command.type === 'update' &&
            typeof command.payload === 'function'
          ) {
            return command.payload(draft);
          } else {
            if (command.type === 'update' && command.target) {
              draft.state[command.target] = command.payload;
            } else if (command.type === 'merge' && command.target) {
              draft.state[command.target] = merge(
                draft.state[command.target],
                command.payload
              );
            } else if (command.type === 'replace') {
              const payload = command.payload;
              const target = command.target || 'id';

              if (typeof payload === 'object' && target in payload) {
                for (const key of Object.keys(draft.state)) {
                  const value = draft.state[key];

                  if (!Array.isArray(value)) continue;

                  const index = value.findIndex((item) => {
                    // 先比對 target 鍵值是否相同
                    if (item[target] !== payload[target]) return false;

                    // 取出兩邊的 key
                    const itemKeys = Object.keys(item);
                    const payloadKeys = Object.keys(payload);

                    // 檢查 key 數量與內容是否完全一致
                    if (itemKeys.length !== payloadKeys.length) return false;

                    return itemKeys.every((key) => payloadKeys.includes(key));
                  });

                  if (index !== -1) {
                    value[index] = payload;
                  }
                }
              }
            } else if (command.type === 'unshift' && command.target) {
              const state = draft.state[command.target];

              if (Array.isArray(state)) {
                state.unshift(command.payload);
              }
            }
          }
        }
      });
    });
  },
}));

export function TMAStoreProvider({ children }: TMAStoreProviderProps) {
  const navigate = useNavigate();
  const client = useTMAClient();
  const { update } = useTMAStore();
  const loadingRef = useRef([]);

  const query = useCallback(
    (path: string, params: QueryParams = {}) => {
      const key = getQueryKey(path, params);

      loadingRef.current.push(key);

      update([
        {
          type: 'update',
          target: 'loading',
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
              type: 'update',
              target: 'loading',
              payload: (draft: Store) => {
                draft.loading = draft.loading.filter((k) => k !== key);
              },
            },
          ]);

          if (res.navigate) {
            navigate(res.navigate.screen, {
              type: 'replace',
              params: res.navigate.params,
            });
          }

          return res;
        })
        .catch((error) => {
          loadingRef.current = loadingRef.current.filter((k) => k !== key);

          update([
            {
              type: 'update',
              target: 'loading',
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

          if (res.navigate) {
            navigate(res.navigate.screen, {
              type: 'replace',
              params: res.navigate.params,
            });
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
            type: 'update',
            target: 'status',
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
            type: 'update',
            target: 'status',
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
      update,
      loadingRef,
    }),
    [query, mutate, update, loadingRef]
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
