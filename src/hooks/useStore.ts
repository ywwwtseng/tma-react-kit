import { useTMAStore } from '../store/TMAStoreContext';
import { get } from '../utils';

export function useStore<T = unknown>(path: string | string[]): T {
  return useTMAStore((store) => get(store.state, path)) as T;
}