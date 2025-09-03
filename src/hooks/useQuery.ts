import React from 'react';
import { useTMAStore, useTMAStoreQuery } from '../store/TMAStoreContext';
import { get } from '../utils';

interface UseQueryOptions {
  gcTime?: number;
}

export function useQuery<T = unknown>(path: string | string[], options: UseQueryOptions = {}) {
  const gcTimeRef = React.useRef(options.gcTime || Infinity);
  const key = JSON.stringify(path);
  const { query, loadingRef } = useTMAStoreQuery();
  const isLoading = useTMAStore((store) => store.loading).includes(key);
  const data = useTMAStore((store) => get(store.state, path)) as T;

  React.useEffect(() => {
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

    query(path);
  }, [JSON.stringify(path)]);

  return {
    isLoading,
    data,
  };
}