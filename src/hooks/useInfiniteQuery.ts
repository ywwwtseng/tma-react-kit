import { use, useMemo, useState, useCallback, useEffect } from 'react';
import {
  useTMAStore,
  TMAStoreContext,
  getQueryKey,
  type Store,
  type QueryParams,
} from '../store/TMAStoreContext';

const getNextPageParam = <T>(lastPage: T | undefined): string | null => {
  return Array.isArray(lastPage)
    ? lastPage?.[lastPage.length - 1]?.created_at ?? null
    : null;
};

interface UseQueryOptions {
  params: QueryParams & {
    limit: number;
  };
  refetchOnMount?: boolean;
  enabled?: boolean;
}

export function useInfiniteQuery<T = unknown>(
  path: string,
  options: UseQueryOptions
) {
  const refetchOnMount = options?.refetchOnMount ?? false;
  const enabled = options?.enabled ?? true;
  const state = useTMAStore((store) => store.state);
  const [pageKeys, setPageKeys] = useState<string[]>([]);
  const data = useMemo(() => {
    return pageKeys.map((key) => state[key]).filter(Boolean) as T[];
  }, [pageKeys, state]);

  const context = use(TMAStoreContext);

  if (!context) {
    throw new Error('useInfiniteQuery must be used within a TMA');
  }

  const { query, update, loadingRef } = context;

  const hasNextPage = useMemo(() => {
    const page = data[data.length - 1];

    if (Array.isArray(page)) {
      const limit = options.params?.limit;

      if (typeof limit === 'number') {
        return page.length === limit;
      }

      if (page.length === 0) {
        return false;
      }
    }

    return true;
  }, [data]);

  const fetchNextPage = useCallback(() => {
    if (!hasNextPage) {
      return;
    }

    const params: QueryParams = options?.params ?? {};

    if (!enabled) {
      return;
    }

    const cursor = getNextPageParam<T>(
      data ? data[data.length - 1] : undefined
    );

    if (cursor) {
      params.cursor = cursor;
    }

    const queryKey = getQueryKey(path, params);

    if (loadingRef.current.includes(queryKey)) {
      return;
    }

    setPageKeys((pageKeys) => [...pageKeys, queryKey]);

    query(path, params);
  }, [path, JSON.stringify(options), hasNextPage, enabled, data]);

  const isLoading = useMemo(() => {
    if (!enabled) {
      return false;
    }

    return pageKeys.length > 0
      ? state[pageKeys[pageKeys.length - 1]] === undefined
      : false;
  }, [pageKeys, state, enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const params = options?.params ?? {};
    const queryKey = getQueryKey(path, params);

    if (loadingRef.current.includes(queryKey)) {
      return;
    }

    if (state[queryKey] !== undefined && refetchOnMount === false) {
      return;
    }

    fetchNextPage();

    return () => {
      if (refetchOnMount) {
        update([
          {
            update: 'state',
            payload: (draft: Store) => {
              pageKeys.forEach((page) => {
                delete draft.state[page];
              });
            },
          },
        ]);

        setPageKeys([]);
      }
    };
  }, [path, JSON.stringify(options), enabled]);

  return {
    data: data.length > 0 ? (data.flat() as T) : undefined,
    isLoading,
    hasNextPage,
    fetchNextPage,
  };
}
