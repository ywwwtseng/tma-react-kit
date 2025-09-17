import { useMemo } from 'react';
import { type LaunchParamsLike } from '@tma.js/transformers';
import {
  mockTelegramEnv,
  retrieveLaunchParamsFp,
  retrieveRawLaunchParamsFp,
  isTMA,
  type RetrieveLaunchParamsError,
  type RetrieveLaunchParamsResult,
  type RetrieveRawLaunchParamsError,
} from '@tma.js/bridge';
import * as E from 'fp-ts/Either';

export const TELEGRAM_ENV: {
  MOCK: {
    launchParams?:
      | (Omit<LaunchParamsLike, 'tgWebAppData'> & {
          tgWebAppData?: string | URLSearchParams;
        })
      | string
      | URLSearchParams;
  };
  DEFAULT: 0;
} = {
  MOCK: {
    launchParams: {
      tgWebAppData: new URLSearchParams([
        [
          'user',
          JSON.stringify({
            id: 6666666666,
            first_name: 'T',
            last_name: 'yw',
            username: 'ywwwtseng',
            language_code: 'zh-hans',
            allows_write_to_pm: true,
            photo_url:
              'https://t.me/i/userpic/320/nQlDMwY_br5G4QK2sd9uK2yC7025mbODcLr8uHJWXX90vnZDywxIOKaH7vXai2FC.svg',
          }),
        ],
        ['chat_instance', '-5440521606958638813'],
        ['chat_type', 'sender'],
        ['auth_date', '1742711181'],
        [
          'signature',
          'FSFXaPVyWU5py8SyqrrstqPm59esA9zohIyPhn-nKJ9XQS47HeYtw5xnJ4SFy2G2fLFX7GQ5l7H4fxExGif8Aw',
        ],
        [
          'hash',
          'f2bc216132e681353f74476947e7cbdbc0afd05bbc53c790f829a11a1ac50883',
        ],
      ]),
      tgWebAppVersion: '8.0',
      tgWebAppPlatform: 'web',
      tgWebAppThemeParams: {
        accent_text_color: '#8774e1',
        bg_color: '#212121',
        button_color: '#8774e1',
        button_text_color: '#ffffff',
        destructive_text_color: '#ff595a',
        header_bg_color: '#212121',
        hint_color: '#aaaaaa',
        link_color: '#8774e1',
        secondary_bg_color: '#181818',
        section_bg_color: '#212121',
        section_header_text_color: '#8774e1',
        subtitle_text_color: '#aaaaaa',
        text_color: '#ffffff',
      },
    },
  },
  DEFAULT: 0,
};

export function useTelegramSDK(
  env?: (typeof TELEGRAM_ENV)[keyof typeof TELEGRAM_ENV]
) {
  return useMemo(() => {
    if (env) {
      mockTelegramEnv(env);
    }

    if (isTMA()) {
      const launchParams = E.getOrElse<
        RetrieveLaunchParamsError,
        RetrieveLaunchParamsResult
      >((err) => {
        console.error('錯誤:', err);
        return null as RetrieveLaunchParamsResult;
      })(retrieveLaunchParamsFp());

      const initDataRaw = E.getOrElse<RetrieveRawLaunchParamsError, string>(
        (err) => {
          console.error('錯誤:', err);
          return null as string;
        }
      )(retrieveRawLaunchParamsFp());

      return {
        launchParams,
        initDataRaw,
      };
    }

    return {
      launchParams: null,
      initDataRaw: null,
    };
  }, []);
}
