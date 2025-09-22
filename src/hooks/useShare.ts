import { useCallback } from 'react';
import { shareURL } from '@telegram-apps/sdk';
import { useTMASDK } from '../store/TMASDKContext';

export function useShare() {
  const { platform } = useTMASDK();

  return useCallback(({ url, text }: { url: string; text: string }) => {
    const isWebOrDesktop =
      platform?.includes('web') ||
      platform === 'macos' ||
      platform === 'tdesktop';

    shareURL(url, isWebOrDesktop ? `\n${text}` : text);
  }, []);
}
