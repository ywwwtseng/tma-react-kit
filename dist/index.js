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

// src/store/TMASDKContext.tsx
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

// src/store/TMASDKContext.tsx
import { jsx } from "react/jsx-runtime";
var TMASDKContext = React.createContext(void 0);
function TMASDKProvider({
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
  return /* @__PURE__ */ jsx(TMASDKContext.Provider, { value, children });
}
function useTMASDK() {
  const context = React.use(TMASDKContext);
  if (!context) {
    throw new Error("useTMA must be used within a TMASDKProvider");
  }
  return context;
}

// src/store/TMAClientContext.tsx
import React2 from "react";
import { Request } from "request";
import { jsx as jsx2 } from "react/jsx-runtime";
var TMAClientContext = React2.createContext(void 0);
function TMAClientProvider({ url, children }) {
  const { initDataRaw } = useTMASDK();
  const request = React2.useMemo(() => new Request({
    baseUrl: url,
    transformRequest(headers) {
      headers.set("Authorization", `tma ${initDataRaw}`);
      return headers;
    }
  }), [url, initDataRaw]);
  const value = React2.useMemo(() => ({
    request
  }), [request]);
  return /* @__PURE__ */ jsx2(TMAClientContext.Provider, { value, children });
}
function useTMAClient() {
  const context = React2.use(TMAClientContext);
  if (!context) {
    throw new Error("useTMA must be used within a TMAClientProvider");
  }
  return context;
}

// src/store/TMAContext.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function TMAProvider({ env, background, url, children }) {
  return /* @__PURE__ */ jsx3(TMASDKProvider, { env, background, children: /* @__PURE__ */ jsx3(TMAClientProvider, { url, children }) });
}

// src/components/Layout.tsx
import React3 from "react";
import { postEvent as postEvent2 } from "@telegram-apps/sdk-react";
import { jsx as jsx4, jsxs } from "react/jsx-runtime";
var HEADER_HEIGHT = 56;
var TAB_BAR_HEIGHT = 60;
function Root({ children }) {
  const { platform } = useTMASDK();
  const safeAreaBottom = platform === "ios" ? 20 : 12;
  return /* @__PURE__ */ jsx4("div", { style: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    height: "100vh",
    paddingTop: HEADER_HEIGHT,
    paddingBottom: TAB_BAR_HEIGHT + safeAreaBottom,
    overflow: "hidden"
  }, children });
}
function Header({ className, logo, children }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className,
      style: {
        width: "100vw",
        height: HEADER_HEIGHT,
        left: 0,
        top: 0,
        padding: "8px 16px",
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px"
      },
      children: [
        logo,
        /* @__PURE__ */ jsx4(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            },
            children
          }
        )
      ]
    }
  );
}
function Main({ className, children }) {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      className,
      style: {
        height: "100%",
        overflowY: "auto"
      },
      children
    }
  );
}
function TabBar({ className, children }) {
  const { platform } = useTMASDK();
  const safeAreaBottom = platform === "ios" ? 20 : 12;
  return /* @__PURE__ */ jsx4(
    "div",
    {
      className,
      style: {
        width: "100vw",
        height: TAB_BAR_HEIGHT + safeAreaBottom,
        left: 0,
        bottom: 0,
        padding: "4px 32px 0px",
        position: "fixed",
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between"
      },
      children
    }
  );
}
function TabBarItem({
  className,
  icon: Icon,
  text,
  active = false,
  onClick
}) {
  const [isActivating, setIsActivating] = React3.useState(false);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      className,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        outline: "none",
        gap: "2px",
        color: active || isActivating ? "white" : "#7c7c7c",
        transition: "color 200ms"
      },
      onClick: () => {
        if (active || isActivating) return;
        postEvent2("web_app_trigger_haptic_feedback", {
          type: "impact",
          impact_style: "light"
        });
        setIsActivating(true);
        setTimeout(() => {
          setIsActivating(false);
        }, 200);
        onClick?.();
      },
      children: [
        /* @__PURE__ */ jsx4("div", { style: {
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: /* @__PURE__ */ jsx4(Icon, { width: 28, height: 28 }) }),
        text
      ]
    }
  );
}
TabBar.Item = TabBarItem;
var Layout = {
  Root,
  Header,
  Main,
  TabBar
};
export {
  HEADER_HEIGHT,
  Layout,
  TAB_BAR_HEIGHT,
  TELEGRAM_ENV,
  TMAClientContext,
  TMAClientProvider,
  TMAProvider,
  TMASDKContext,
  TMASDKProvider,
  useTMAClient,
  useTMASDK,
  useTelegramSDK
};
