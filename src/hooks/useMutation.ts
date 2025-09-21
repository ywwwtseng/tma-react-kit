import { use, useState, useCallback } from 'react';
import { useRefValue } from '@ywwwtseng/react-kit';
import {
  MutateOptions,
  TMAStoreContext,
  ResponseData,
} from '../store/TMAStoreContext';

export function useMutation() {
  const context = use(TMAStoreContext);

  if (!context) {
    throw new Error('useMutation must be used within a TMA');
  }

  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRefValue(isLoading);

  const mutate = useCallback(
    <T = unknown>(
      action: string,
      payload?: T,
      options?: MutateOptions
    ): Promise<ResponseData> => {
      if (isLoadingRef.current) {
        return;
      }

      setIsLoading(true);

      return context.mutate(action, payload, options).finally(() => {
        setIsLoading(false);
      });
    },
    [context.mutate]
  );

  return {
    mutate,
    isLoading,
  };
}
