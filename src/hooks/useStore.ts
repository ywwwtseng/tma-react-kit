import { get } from '@ywwwtseng/utils';
import { useTMAStore } from '../store/TMAStoreContext';

export function useStore<T = unknown>(path: string | string[]): T | undefined {
  return useTMAStore((store) => get(store.state, path)) as T | undefined;
}
