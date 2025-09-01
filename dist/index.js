// src/hooks/useTelegramSDK.ts
import { useMemo } from "react";
import {
  mockTelegramEnv,
  retrieveLaunchParams,
  retrieveRawInitData,
  isTMA
} from "@telegram-apps/sdk-react";
var TELEGRAM_ENV = {
  MOCK: {
    launchParams: {
      tgWebAppData: new URLSearchParams([
        ["user", JSON.stringify({
          id: 6666666666,
          first_name: "T",
          last_name: "yw",
          username: "ywwwtseng",
          language_code: "zh-hans",
          allows_write_to_pm: true,
          photo_url: "https://t.me/i/userpic/320/nQlDMwY_br5G4QK2sd9uK2yC7025mbODcLr8uHJWXX90vnZDywxIOKaH7vXai2FC.svg"
        })],
        ["chat_instance", "-5440521606958638813"],
        ["chat_type", "sender"],
        ["auth_date", "1742711181"],
        ["signature", "FSFXaPVyWU5py8SyqrrstqPm59esA9zohIyPhn-nKJ9XQS47HeYtw5xnJ4SFy2G2fLFX7GQ5l7H4fxExGif8Aw"],
        ["hash", "f2bc216132e681353f74476947e7cbdbc0afd05bbc53c790f829a11a1ac50883"]
      ]),
      tgWebAppVersion: "8.0",
      tgWebAppPlatform: "web",
      tgWebAppThemeParams: {
        accent_text_color: "#8774e1",
        bg_color: "#212121",
        button_color: "#8774e1",
        button_text_color: "#ffffff",
        destructive_text_color: "#ff595a",
        header_bg_color: "#212121",
        hint_color: "#aaaaaa",
        link_color: "#8774e1",
        secondary_bg_color: "#181818",
        section_bg_color: "#212121",
        section_header_text_color: "#8774e1",
        subtitle_text_color: "#aaaaaa",
        text_color: "#ffffff"
      }
    }
  },
  DEFAULT: 0
};
function useTelegramSDK(env) {
  return useMemo(() => {
    if (env) {
      mockTelegramEnv(env);
    }
    if (isTMA()) {
      const launchParams = retrieveLaunchParams();
      const initDataRaw = retrieveRawInitData();
      return {
        launchParams,
        initDataRaw
      };
    }
    return {
      launchParams: null,
      initDataRaw: null
    };
  }, []);
}

// src/store/TMAContext.tsx
import React from "react";
import { init, postEvent } from "@telegram-apps/sdk-react";

// src/hooks/useClientOnce.ts
import { useEffect, useRef } from "react";
function useClientOnce(setup) {
  const canCall = useRef(true);
  useEffect(() => {
    if (!canCall.current) {
      return;
    }
    canCall.current = false;
    const destroy = setup();
    return () => {
      if (destroy) {
        destroy();
      }
    };
  }, []);
}

// src/store/TMAContext.tsx
import { jsx } from "react/jsx-runtime";
var TMAContext = React.createContext(void 0);
function TMAProvider({
  env,
  background = "#000000",
  children
}) {
  const { launchParams, initDataRaw } = useTelegramSDK(env);
  const user = launchParams?.tgWebAppData?.user;
  const platform = launchParams?.tgWebAppPlatform;
  const [avatar, setAvatar] = React.useState(null);
  const value = React.useMemo(() => ({
    initDataRaw,
    user,
    platform,
    avatar
  }), [initDataRaw, user, platform, avatar]);
  useClientOnce(() => {
    if (env !== TELEGRAM_ENV.MOCK && launchParams) {
      init();
      postEvent("web_app_set_header_color", { color: background });
      postEvent("web_app_set_bottom_bar_color", { color: background });
      postEvent("web_app_set_background_color", { color: background });
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
  return /* @__PURE__ */ jsx(TMAContext.Provider, { value, children });
}
function useTMA() {
  const context = React.use(TMAContext);
  if (!context) {
    throw new Error("useTMA must be used within a TMAProvider");
  }
  return context;
}
export {
  TELEGRAM_ENV,
  TMAContext,
  TMAProvider,
  useTMA,
  useTelegramSDK
};
