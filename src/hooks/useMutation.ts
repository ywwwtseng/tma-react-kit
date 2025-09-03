import React from 'react';
import { useRefValue } from '@ywwwtseng/react-kit';
import { useTMAStoreMutate } from '../store/TMAStoreContext';

export function useMutation<T = unknown>() {
  const mutate = useTMAStoreMutate();
  const [isLoading, setIsLoading] = React.useState(false);
  const isLoadingRef = useRefValue(isLoading);

  return {
    mutate: (action: string, payload: T) => {
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