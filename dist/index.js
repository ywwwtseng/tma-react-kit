// src/store/TMASDKContext.tsx
import React from "react";
import { init, postEvent } from "@telegram-apps/sdk-react";

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
import { Request } from "@ywwwtseng/request";
import { jsx as jsx2 } from "react/jsx-runtime";
var TMAClientContext = React2.createContext(void 0);
function TMAClientProvider({ url, children }) {
  const { initDataRaw } = useTMASDK();
  const request = React2.useMemo(() => new Request({
    transformRequest(headers) {
      headers.set("Authorization", `tma ${initDataRaw}`);
      return headers;
    }
  }), [url, initDataRaw]);
  const query = React2.useCallback((path) => {
    path = Array.isArray(path) ? path : [path];
    return request.post(url, { type: "query", path });
  }, [request]);
  const mutate = React2.useCallback((action, payload) => {
    return request.post(url, { type: "mutate", action, payload });
  }, [request]);
  const value = React2.useMemo(() => ({
    query,
    mutate
  }), [query, mutate]);
  return /* @__PURE__ */ jsx2(TMAClientContext.Provider, { value, children });
}
function useTMAClient() {
  const context = React2.use(TMAClientContext);
  if (!context) {
    throw new Error("useTMA must be used within a TMAClientProvider");
  }
  return context;
}

// src/store/TMAStoreContext.tsx
import React3 from "react";
import { create } from "zustand";

// src/utils/index.ts
function update(obj, path, value) {
  path = typeof path === "string" ? [path] : path;
  if (path.length === 0) return obj;
  const [key, ...rest] = path;
  return {
    ...obj,
    [key]: rest.length > 0 ? update(obj[key] ?? {}, rest, value) : value
  };
}
var get = (obj, path, callback) => {
  const keys = typeof path === "string" ? path.split(".") : path;
  let anchor = obj;
  for (let i = 0; i < keys.length; i++) {
    anchor = anchor[keys[i]];
    if (anchor === void 0) {
      return callback ?? void 0;
    }
  }
  return anchor;
};

// src/store/TMAStoreContext.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var Status = /* @__PURE__ */ ((Status2) => {
  Status2[Status2["Loading"] = 0] = "Loading";
  Status2[Status2["Authenticated"] = 1] = "Authenticated";
  Status2[Status2["Unauthenticated"] = 2] = "Unauthenticated";
  Status2[Status2["Forbidden"] = 3] = "Forbidden";
  return Status2;
})(Status || {});
var TMAStoreContext = React3.createContext(void 0);
var useTMAStore = create((set) => ({
  status: 0 /* Loading */,
  state: {},
  loading: [],
  update: (commands) => {
    set((store) => {
      commands = Array.isArray(commands) ? commands : [commands];
      for (const command of commands) {
        if (typeof command.payload === "function") {
          store = command.payload(store);
        } else {
          store = {
            ...store,
            state: update(store.state, command.update, command.payload)
          };
        }
      }
      return store;
    });
  }
}));
function TMAStoreProvider({ children }) {
  const client = useTMAClient();
  const { update: update2 } = useTMAStore();
  const loadingRef = React3.useRef([]);
  const query = React3.useCallback((path) => {
    const key = JSON.stringify(path);
    loadingRef.current.push(key);
    update2({
      update: ["loading"],
      payload: (store) => ({
        ...store,
        loading: [...store.loading, key]
      })
    });
    return client.query(path).then((res) => {
      loadingRef.current = loadingRef.current.filter((k) => k !== key);
      update2([
        ...res.commands,
        {
          update: ["loading"],
          payload: (store) => ({
            ...store,
            loading: store.loading.filter((k) => k !== key)
          })
        }
      ]);
      return res;
    }).catch(() => {
      loadingRef.current = loadingRef.current.filter((k) => k !== key);
      update2({
        update: ["loading"],
        payload: (store) => ({
          ...store,
          loading: store.loading.filter((k) => k !== key)
        })
      });
    });
  }, [client.query]);
  const mutate = React3.useCallback((action, payload) => {
    const key = JSON.stringify({ action, payload });
    update2({
      update: ["loading"],
      payload: (store) => ({
        ...store,
        loading: [...store.loading, key]
      })
    });
    return client.mutate(action, payload).then((res) => {
      update2(res.commands);
      return res;
    });
  }, [client.mutate]);
  React3.useEffect(() => {
    mutate("init").then(() => {
      update2({
        update: ["status"],
        payload: 1 /* Authenticated */
      });
    }).catch((error) => {
      console.error(error);
      update2({
        update: ["status"],
        payload: 3 /* Forbidden */
      });
    });
  }, [mutate]);
  const value = React3.useMemo(() => ({
    query,
    mutate,
    loadingRef
  }), [query, mutate, loadingRef]);
  return /* @__PURE__ */ jsx3(TMAStoreContext.Provider, { value, children });
}
function useTMAStoreQuery() {
  const context = React3.use(TMAStoreContext);
  if (!context) {
    throw new Error("useTMA must be used within a TMAStoreProvider");
  }
  return {
    query: context.query,
    loadingRef: context.loadingRef
  };
}
function useTMAStoreMutate() {
  const context = React3.use(TMAStoreContext);
  if (!context) {
    throw new Error("useTMA must be used within a TMAStoreProvider");
  }
  return context.mutate;
}

// src/store/TMAI18nContext.tsx
import React4 from "react";

// src/hooks/useStore.ts
function useStore(path) {
  return useTMAStore((store) => get(store.state, path));
}

// src/store/TMAI18nContext.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
var TMAI18nContext = React4.createContext(void 0);
function TMAI18nProvider({ locales, children }) {
  const settings = useStore("settings");
  const t = React4.useCallback((key, params) => {
    if (!locales) return key;
    const locale = locales?.[settings?.language_code?.toLowerCase()?.slice(0, 2)] || locales[localStorage.getItem("language_code") || "en"];
    if (!locale || typeof key !== "string") return key;
    const template = get(locale, key, key);
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_, key2) => String(params[key2]) || "");
  }, [settings]);
  const value = React4.useMemo(() => ({
    t
  }), [t]);
  return /* @__PURE__ */ jsx4(TMAI18nContext.Provider, { value, children });
}
function useTMAI18n() {
  const context = React4.use(TMAI18nContext);
  if (!context) {
    throw new Error("useTMA must be used within a TMAI18nProvider");
  }
  return context;
}

// src/store/TMAContext.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function TMAProvider({ env, background, url, locales, children }) {
  return /* @__PURE__ */ jsx5(TMASDKProvider, { env, background, children: /* @__PURE__ */ jsx5(TMAClientProvider, { url, children: /* @__PURE__ */ jsx5(TMAStoreProvider, { children: /* @__PURE__ */ jsx5(TMAI18nProvider, { locales, children }) }) }) });
}

// src/hooks/useQuery.ts
import React5 from "react";
function useQuery(path, options = {}) {
  const gcTimeRef = React5.useRef(options.gcTime || Infinity);
  const key = JSON.stringify(path);
  const { query, loadingRef } = useTMAStoreQuery();
  const isLoading = useTMAStore((store) => store.loading).includes(key);
  const data = useTMAStore((store) => get(store.state, path));
  React5.useEffect(() => {
    if (loadingRef.current.includes(key)) {
      return;
    }
    if (gcTimeRef.current > 0 && gcTimeRef.current !== Infinity) {
      setTimeout(() => {
        gcTimeRef.current = 0;
      }, gcTimeRef.current);
    }
    if (data !== void 0 && gcTimeRef.current > 0) {
      return;
    }
    query(path);
  }, [JSON.stringify(path)]);
  return {
    isLoading,
    data
  };
}

// src/hooks/useMutation.ts
import React7 from "react";

// src/hooks/useRefValue.ts
import React6 from "react";
function useRefValue(value) {
  const ref = React6.useRef(value);
  React6.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

// src/hooks/useMutation.ts
function useMutation() {
  const mutate = useTMAStoreMutate();
  const [isLoading, setIsLoading] = React7.useState(false);
  const isLoadingRef = useRefValue(isLoading);
  return {
    mutate: (action, payload) => {
      if (isLoadingRef.current) {
        return;
      }
      setIsLoading(true);
      mutate(action, payload).finally(() => {
        setIsLoading(false);
      });
    },
    isLoading
  };
}

// src/components/Layout.tsx
import React8 from "react";
import { postEvent as postEvent2 } from "@telegram-apps/sdk-react";
import { jsx as jsx6, jsxs } from "react/jsx-runtime";
var HEADER_HEIGHT = 56;
var TAB_BAR_HEIGHT = 60;
function Root({ children }) {
  const { platform } = useTMASDK();
  const safeAreaBottom = platform === "ios" ? 20 : 12;
  return /* @__PURE__ */ jsx6("div", { style: {
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
        /* @__PURE__ */ jsx6(
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
  return /* @__PURE__ */ jsx6(
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
  return /* @__PURE__ */ jsx6(
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
  const [isActivating, setIsActivating] = React8.useState(false);
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
        width: "54px",
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
        /* @__PURE__ */ jsx6("div", { style: {
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: /* @__PURE__ */ jsx6(Icon, { width: 28, height: 28 }) }),
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

// src/components/Typography.tsx
import * as ReactKit from "@ywwwtseng/react-kit";
import { jsx as jsx7 } from "react/jsx-runtime";
function Typography2({ i18n, params, children, ...props }) {
  const { t } = useTMAI18n();
  return /* @__PURE__ */ jsx7(ReactKit.Typography, { ...props, children: i18n ? t(i18n, params) : children });
}

// src/components/LanguageMenu.tsx
import { Dropdown } from "@ywwwtseng/react-kit";
import { jsx as jsx8 } from "react/jsx-runtime";
var languages = [
  {
    key: "en",
    name: "English",
    icon: "https://hatscripts.github.io/circle-flags/flags/gb.svg"
  },
  {
    key: "zh",
    name: "\u4E2D\u6587",
    icon: "https://hatscripts.github.io/circle-flags/flags/tw.svg"
  }
];
function LanguageMenu() {
  const settings = useStore("settings");
  const mutate = useTMAStoreMutate();
  const language = languages.find((language2) => language2.key === settings?.language_code || language2.key === localStorage.getItem("language_code"));
  return /* @__PURE__ */ jsx8(Dropdown, { items: languages, onChange: (key) => {
    localStorage.setItem("language_code", key);
    mutate("update:settings", { language_code: key });
  }, children: /* @__PURE__ */ jsx8("button", { style: { display: language ? "block" : "none" }, children: /* @__PURE__ */ jsx8("img", { src: language?.icon, width: "40", height: "40", alt: language?.name }) }) });
}
export {
  HEADER_HEIGHT,
  LanguageMenu,
  Layout,
  Status,
  TAB_BAR_HEIGHT,
  TELEGRAM_ENV,
  TMAClientContext,
  TMAClientProvider,
  TMAI18nContext,
  TMAI18nProvider,
  TMAProvider,
  TMASDKContext,
  TMASDKProvider,
  TMAStoreContext,
  TMAStoreProvider,
  Typography2 as Typography,
  useMutation,
  useQuery,
  useStore,
  useTMAClient,
  useTMAI18n,
  useTMASDK,
  useTMAStore,
  useTMAStoreMutate,
  useTMAStoreQuery,
  useTelegramSDK
};
