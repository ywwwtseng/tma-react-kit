// src/store/TMASDKContext.tsx
import { useMemo as useMemo2, useEffect as useEffect2, createContext, useState, use } from "react";
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
var TMASDKContext = createContext(void 0);
function TMASDKProvider({
  env,
  background = "#000000",
  children
}) {
  const { launchParams, initDataRaw } = useTelegramSDK(env);
  const user = launchParams?.tgWebAppData?.user;
  const platform = launchParams?.tgWebAppPlatform;
  const [avatar, setAvatar] = useState(null);
  const value = useMemo2(() => ({
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
  useEffect2(() => {
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
  const context = use(TMASDKContext);
  if (!context) {
    throw new Error("useTMA must be used within a TMASDKProvider");
  }
  return context;
}

// src/store/TMAClientContext.tsx
import { useMemo as useMemo3, useCallback, createContext as createContext2, use as use2 } from "react";
import { Request } from "@ywwwtseng/request";
import { jsx as jsx2 } from "react/jsx-runtime";
var TMAClientContext = createContext2(void 0);
function TMAClientProvider({ url, children }) {
  const { initDataRaw } = useTMASDK();
  const request = useMemo3(() => new Request({
    transformRequest(headers) {
      headers.set("Authorization", `tma ${initDataRaw}`);
      return headers;
    }
  }), [url, initDataRaw]);
  const query = useCallback((path) => {
    path = Array.isArray(path) ? path : [path];
    return request.post(url, { type: "query", path });
  }, [request]);
  const mutate = useCallback((action, payload) => {
    return request.post(url, { type: "mutate", action, payload });
  }, [request]);
  const value = useMemo3(() => ({
    query,
    mutate
  }), [query, mutate]);
  return /* @__PURE__ */ jsx2(TMAClientContext.Provider, { value, children });
}
function useTMAClient() {
  const context = use2(TMAClientContext);
  if (!context) {
    throw new Error("useTMA must be used within a TMAClientProvider");
  }
  return context;
}

// src/store/TMAStoreContext.tsx
import { createContext as createContext3, useRef as useRef2, useCallback as useCallback2, useEffect as useEffect3, useMemo as useMemo4, use as use3 } from "react";
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
var TMAStoreContext = createContext3(void 0);
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
  const loadingRef = useRef2([]);
  const query = useCallback2((path) => {
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
  const mutate = useCallback2((action, payload) => {
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
  useEffect3(() => {
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
  const value = useMemo4(() => ({
    query,
    mutate,
    loadingRef
  }), [query, mutate, loadingRef]);
  return /* @__PURE__ */ jsx3(TMAStoreContext.Provider, { value, children });
}
function useTMAStoreQuery() {
  const context = use3(TMAStoreContext);
  if (!context) {
    throw new Error("useTMA must be used within a TMAStoreProvider");
  }
  return {
    query: context.query,
    loadingRef: context.loadingRef
  };
}
function useTMAStoreMutate() {
  const context = use3(TMAStoreContext);
  if (!context) {
    throw new Error("useTMA must be used within a TMAStoreProvider");
  }
  return context.mutate;
}

// src/store/TMAI18nContext.tsx
import { useCallback as useCallback3, useMemo as useMemo5, createContext as createContext4, use as use4 } from "react";

// src/hooks/useStore.ts
function useStore(path) {
  return useTMAStore((store) => get(store.state, path));
}

// src/store/TMAI18nContext.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
var TMAI18nContext = createContext4(void 0);
function TMAI18nProvider({ locales, children }) {
  const settings = useStore("settings");
  const t = useCallback3((key, params) => {
    if (!locales) return key;
    const locale = locales?.[settings?.language_code?.toLowerCase()?.slice(0, 2)] || locales[localStorage.getItem("language_code") || "en"];
    if (!locale || typeof key !== "string") return key;
    const template = get(locale, key, key);
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_, key2) => String(params[key2]) || "");
  }, [settings]);
  const value = useMemo5(() => ({
    t
  }), [t]);
  return /* @__PURE__ */ jsx4(TMAI18nContext.Provider, { value, children });
}
function useTMAI18n() {
  const context = use4(TMAI18nContext);
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
import React from "react";
function useQuery(path, options = {}) {
  const gcTimeRef = React.useRef(options.gcTime || Infinity);
  const key = JSON.stringify(path);
  const { query, loadingRef } = useTMAStoreQuery();
  const isLoading = useTMAStore((store) => store.loading).includes(key);
  const data = useTMAStore((store) => get(store.state, path));
  React.useEffect(() => {
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
import React3 from "react";

// src/hooks/useRefValue.ts
import React2 from "react";
function useRefValue(value) {
  const ref = React2.useRef(value);
  React2.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

// src/hooks/useMutation.ts
function useMutation() {
  const mutate = useTMAStoreMutate();
  const [isLoading, setIsLoading] = React3.useState(false);
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
import { useState as useState2 } from "react";
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
  const [isActivating, setIsActivating] = useState2(false);
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
import { jsx as jsx8, jsxs as jsxs2 } from "react/jsx-runtime";
var icons = {
  en: /* @__PURE__ */ jsxs2("svg", { xmlns: "http://www.w3.org/2000/svg", width: "40", height: "40", viewBox: "0 0 512 512", children: [
    /* @__PURE__ */ jsx8("mask", { id: "a", children: /* @__PURE__ */ jsx8("circle", { cx: "256", cy: "256", r: "256", fill: "#fff" }) }),
    /* @__PURE__ */ jsxs2("g", { mask: "url(#a)", children: [
      /* @__PURE__ */ jsx8("path", { fill: "#eee", d: "m0 0 8 22-8 23v23l32 54-32 54v32l32 48-32 48v32l32 54-32 54v68l22-8 23 8h23l54-32 54 32h32l48-32 48 32h32l54-32 54 32h68l-8-22 8-23v-23l-32-54 32-54v-32l-32-48 32-48v-32l-32-54 32-54V0l-22 8-23-8h-23l-54 32-54-32h-32l-48 32-48-32h-32l-54 32L68 0H0z" }),
      /* @__PURE__ */ jsx8("path", { fill: "#0052b4", d: "M336 0v108L444 0Zm176 68L404 176h108zM0 176h108L0 68ZM68 0l108 108V0Zm108 512V404L68 512ZM0 444l108-108H0Zm512-108H404l108 108Zm-68 176L336 404v108z" }),
      /* @__PURE__ */ jsx8("path", { fill: "#d80027", d: "M0 0v45l131 131h45L0 0zm208 0v208H0v96h208v208h96V304h208v-96H304V0h-96zm259 0L336 131v45L512 0h-45zM176 336 0 512h45l131-131v-45zm160 0 176 176v-45L381 336h-45z" })
    ] })
  ] }),
  zh: /* @__PURE__ */ jsxs2("svg", { xmlns: "http://www.w3.org/2000/svg", width: "40", height: "40", viewBox: "0 0 512 512", children: [
    /* @__PURE__ */ jsx8("mask", { id: "a", children: /* @__PURE__ */ jsx8("circle", { cx: "256", cy: "256", r: "256", fill: "#fff" }) }),
    /* @__PURE__ */ jsxs2("g", { mask: "url(#a)", children: [
      /* @__PURE__ */ jsx8("path", { fill: "#d80027", d: "M0 256 256 0h256v512H0z" }),
      /* @__PURE__ */ jsx8("path", { fill: "#0052b4", d: "M256 256V0H0v256z" }),
      /* @__PURE__ */ jsx8("path", { fill: "#eee", d: "m222.6 149.8-31.3 14.7 16.7 30.3-34-6.5-4.3 34.3-23.6-25.2-23.7 25.2-4.3-34.3-34 6.5 16.7-30.3-31.2-14.7 31.2-14.7-16.6-30.3 34 6.5 4.2-34.3 23.7 25.3L169.7 77l4.3 34.3 34-6.5-16.7 30.3z" }),
      /* @__PURE__ */ jsx8("circle", { cx: "146.1", cy: "149.8", r: "47.7", fill: "#0052b4" }),
      /* @__PURE__ */ jsx8("circle", { cx: "146.1", cy: "149.8", r: "41.5", fill: "#eee" })
    ] })
  ] })
};
var languages = [
  {
    key: "en",
    name: "English",
    icon: icons.en
  },
  {
    key: "zh",
    name: "\u4E2D\u6587",
    icon: icons.zh
  }
];
function LanguageMenu({ className }) {
  const settings = useStore("settings");
  const mutate = useTMAStoreMutate();
  const language = languages.find((language2) => language2.key === settings?.language_code || language2.key === localStorage.getItem("language_code"));
  return /* @__PURE__ */ jsx8(Dropdown, { className, items: languages, onChange: (key) => {
    localStorage.setItem("language_code", key);
    mutate("update:settings", { language_code: key });
  }, children: /* @__PURE__ */ jsx8("button", { style: { display: language ? "block" : "none" }, children: icons[language?.key] }) });
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
