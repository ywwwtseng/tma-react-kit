import { use, useEffect, useRef } from 'react';
import {
  useTMAStore,
  TMAStoreContext,
  getQueryKey,
  type QueryParams,
} from '../store/TMAStoreContext';

interface UseQueryOptions {
  gcTime?: number;
  enabled?: boolean;
}

export function useQuery<T = unknown>(
  path: string,
  params: QueryParams = {},
  options: UseQueryOptions = {}
) {
  const context = use(TMAStoreContext);

  if (!context) {
    throw new Error('useQuery must be used within a TMA');
  }

  const { query, loadingRef } = context;

  const gcTimeRef = useRef(options.gcTime || Infinity);
  const enabled = options.enabled ?? true;
  const key = getQueryKey(path, params);
  const isLoading = useTMAStore((store) => store.loading).includes(key);
  const data = useTMAStore((store) => store.state[key]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

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
  }, [key, enabled]);

  return {
    isLoading,
    data: data as T | undefined,
  };
}
