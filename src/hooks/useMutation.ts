import { use, useState, useCallback } from 'react';
import { useRefValue } from '@ywwwtseng/react-kit';
import { toast } from 'react-toastify';
import {
  type ResponseData,
  type ResponseError,
  MutateOptions,
  TMAStoreContext,
} from '../store/TMAStoreContext';
import { useTMAI18n } from '../store/TMAI18nContext';

export interface UseMutationOptions {
  onError?: (error: ResponseError) => void;
}

export function useMutation(
  action: string,
  { onError }: UseMutationOptions = {}
) {
  const context = use(TMAStoreContext);
  const { t } = useTMAI18n();

  if (!context) {
    throw new Error('useMutation must be used within a TMA');
  }

  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRefValue(isLoading);

  const mutate = useCallback(
    <T = unknown>(
      payload?: T,
      options?: MutateOptions
    ): Promise<ResponseData> => {
      if (isLoadingRef.current) {
        return;
      }

      isLoadingRef.current = true;
      setIsLoading(true);

      return context
        .mutate(action, payload, options)
        .then((res: ResponseData) => {
          if (res.notify) {
            toast[res.notify.type || 'default']?.(t(res.notify.message));
          }

          return res;
        })
        .catch((res: ResponseError) => {
          toast.error(t(res?.data?.error));
          onError?.(res);
          return {
            ok: false,
          };
        })
        .finally(() => {
          isLoadingRef.current = false;
          setIsLoading(false);
        });
    },
    [context.mutate, action]
  );

  return {
    mutate,
    isLoading,
  };
}
