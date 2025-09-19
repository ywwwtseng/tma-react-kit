import { useEffect, useRef } from 'react';
import { get } from '@ywwwtseng/ywjs';
import { useTMAStore, useTMAStoreQuery } from '../store/TMAStoreContext';

type UseQueryParams = Record<string, string | number | boolean>;

interface UseQueryOptions {
  gcTime?: number;
}

export function useQuery<T = unknown>(
  path: string | string[],
  params: UseQueryParams = {},
  options: UseQueryOptions = {}
) {
  const gcTimeRef = useRef(options.gcTime || Infinity);
  const key = JSON.stringify(path);
  const { query, loadingRef } = useTMAStoreQuery();
  const isLoading = useTMAStore((store) => store.loading).includes(key);
  const data = useTMAStore((store) => get(store.state, path));

  useEffect(() => {
    if (loadingRef.current.includes(key)) {
      return;
    }

    if (gcTimeRef.current > 0 && gcTimeRef.current !== Infinity) {
      setTimeout(() => {
        gcTimeRef.current = 0;
      }, gcTimeRef.current);
    }

    if (data !== undefined && gcTimeRef.current > 0) {
      return;
    }

    query(path, params);
  }, [JSON.stringify(path), JSON.stringify(params)]);

  return {
    isLoading,
    data: data as T | undefined,
  };
}
