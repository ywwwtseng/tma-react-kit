import { useCallback } from 'react';
import { useTMASDK } from '../providers/TMASDKProvider';
import { openTelegramLink } from '../utils';

export function useShare() {
  const { platform } = useTMASDK();

  return useCallback(({ url, text }: { url: string; text: string }) => {
    const isWebOrDesktop =
      platform?.includes('web') ||
      platform === 'macos' ||
      platform === 'tdesktop';

    text = isWebOrDesktop ? `\n${text}` : text;

    openTelegramLink(
      `https://t.me/share/url?` +
        new URLSearchParams({ url, text: text || '' })
          .toString()
          // By default, URL search params encode spaces with "+".
          // We are replacing them with "%20", because plus symbols are working incorrectly
          // in Telegram.
          .replace(/\+/g, '%20')
    );
  }, []);
}
