import React from 'react';
import { useTMAStore, useTMAStoreQuery } from '../store/TMAStoreContext';
import { useRefValue } from './useRefValue';
import { get } from '../utils';

export function useQuery(path: string | string[]) {
  const key = JSON.stringify(path);
  const query = useTMAStoreQuery();
  const isLoading = useTMAStore((store) => store.loading).includes(key);
  const isLoadingRef = useRefValue(isLoading);
  const data = useTMAStore((store) => get(store.state, path));

  React.useEffect(() => {
    if (isLoadingRef.current) {
      return;
    }

    query(path);
  }, [JSON.stringify(path)]);

  return React.useMemo(() => ({
    isLoading,
    data,
  }), [isLoading, data]);
}