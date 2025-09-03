import React from 'react';
import { useTMAStoreMutate } from '../store/TMAStoreContext';
import { useRefValue } from './useRefValue';

export function useMutation() {
  const mutate = useTMAStoreMutate();
  const [isLoading, setIsLoading] = React.useState(false);
  const isLoadingRef = useRefValue(isLoading);

  return {
    mutate: (action: string, payload: unknown) => {
      if (isLoadingRef.current) {
        return;
      }

      setIsLoading(true);

      mutate(action, payload)
       .finally(() => {
        setIsLoading(false);
       });
    },
    isLoading,
  };
}