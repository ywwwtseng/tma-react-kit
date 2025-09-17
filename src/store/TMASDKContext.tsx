import {
  useMemo,
  useEffect,
  createContext,
  useState,
  use,
  type PropsWithChildren,
} from 'react';
import { postEvent, isTMA } from '@tma.js/bridge';
import { useClientOnce } from '@ywwwtseng/react-kit';
import { useTelegramSDK, TELEGRAM_ENV } from '../hooks/useTelegramSDK';

export type User = {
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  first_name: string;
  id: number;
  is_bot?: boolean;
  is_premium?: boolean;
  last_name?: string;
  language_code?: string;
  photo_url?: string;
  username?: string;
} & {
  [key: string]: unknown;
};

export interface TMASDKContextState {
  initDataRaw: string | null | undefined;
  user: User | undefined;
  platform: string | undefined;
  avatar: HTMLImageElement | null;
}

export const TMASDKContext = createContext<TMASDKContextState | undefined>(
  undefined
);

export interface TMASDKProviderProps extends PropsWithChildren {
  env?: (typeof TELEGRAM_ENV)[keyof typeof TELEGRAM_ENV];
  background?: `#${string}`;
}

export function TMASDKProvider({
  env,
  background = '#000000',
  children,
}: TMASDKProviderProps) {
  const { launchParams, initDataRaw } = useTelegramSDK(env);
  const user = launchParams?.tgWebAppData?.user;
  const platform = launchParams?.tgWebAppPlatform;
  const [avatar, setAvatar] = useState<HTMLImageElement | null>(null);

  const value = useMemo(
    () => ({
      initDataRaw,
      user,
      platform,
      avatar,
    }),
    [initDataRaw, user, platform, avatar]
  );

  useClientOnce(() => {
    if (env === TELEGRAM_ENV.DEFAULT && isTMA()) {
      postEvent('web_app_set_header_color', { color: background });
      postEvent('web_app_set_bottom_bar_color', { color: background });
      postEvent('web_app_set_background_color', { color: background });
    }
  });

  useEffect(() => {
    if (user?.photo_url) {
      const image = new Image();

      image.onload = () => {
        setAvatar(image);
      };
      image.src = user.photo_url;
    }
  }, [user]);

  return (
    <TMASDKContext.Provider value={value}>{children}</TMASDKContext.Provider>
  );
}

export function useTMASDK(): TMASDKContextState {
  const context = use(TMASDKContext);

  if (!context) {
    throw new Error('useTMA must be used within a TMASDKProvider');
  }

  return context;
}
