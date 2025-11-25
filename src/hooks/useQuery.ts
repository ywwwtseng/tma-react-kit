import { use, useEffect } from 'react';
import { useRoute } from '@ywwwtseng/react-kit';
import { toast } from 'react-toastify';
import { useTMAI18n } from '../store/TMAI18nContext';
import {
  useTMAStore,
  TMAStoreContext,
  getQueryKey,
  type QueryParams,
} from '../store/TMAStoreContext';

interface UseQueryOptions {
  params?: QueryParams;
  refetchOnMount?: boolean;
  enabled?: boolean;
}

export function useQuery<T = unknown>(path: string, options?: UseQueryOptions) {
  const route = useRoute();
  const context = use(TMAStoreContext);
  const { t } = useTMAI18n();

  if (!context) {
    throw new Error('useQuery must be used within a TMA');
  }

  const { query, loadingRef } = context;
  const params = options?.params ?? {};
  const refetchOnMount = options?.refetchOnMount ?? false;
  const enabled = options?.enabled ?? true;
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

    if (data !== undefined && refetchOnMount === false) {
      return;
    }

    query(path, params, {
      onNotify: (notify) => {
        toast[notify.type || 'default']?.(t(notify.message));
      },
    });
  }, [key, enabled, route.name]);

  return {
    isLoading,
    data: data as T | undefined,
  };
}
