import React from 'react';
import { type User, type Platform, init, postEvent } from '@telegram-apps/sdk-react';
import { useTelegramSDK, TELEGRAM_ENV } from '../hooks/useTelegramSDK';
import { useClientOnce } from '../hooks/useClientOnce';

export interface TMASDKContextState {
  initDataRaw: string | null | undefined;
  user: User | undefined;
  platform: Platform | undefined;
  avatar: HTMLImageElement | null;
}

export const TMASDKContext = React.createContext<TMASDKContextState | undefined>(undefined);

export interface TMASDKProviderProps extends React.PropsWithChildren {
  env?: typeof TELEGRAM_ENV[keyof typeof TELEGRAM_ENV];
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
  const [avatar, setAvatar] = React.useState<HTMLImageElement | null>(null);

  const value = React.useMemo(() => ({
    initDataRaw,
    user,
    platform,
    avatar,
  }), [initDataRaw, user, platform, avatar]);

  useClientOnce(() => {
    if (env !== TELEGRAM_ENV.MOCK && launchParams) {
      init();
      postEvent('web_app_set_header_color', { color: background });
      postEvent('web_app_set_bottom_bar_color', { color: background });
      postEvent('web_app_set_background_color', { color: background });
    }
  });

  React.useEffect(() => {
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
  const context = React.use(TMASDKContext);

  if (!context) {
    throw new Error('useTMA must be used within a TMASDKProvider');
  }

  return context;
}
