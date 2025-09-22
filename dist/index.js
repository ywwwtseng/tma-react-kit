// src/store/TMASDKContext.tsx
import {
  useMemo as useMemo2,
  useEffect,
  createContext,
  useState,
  use
} from "react";
import { postEvent, isTMA as isTMA2 } from "@tma.js/bridge";
import { useClientOnce } from "@ywwwtseng/react-kit";

// src/hooks/useTelegramSDK.ts
import { useMemo } from "react";
import {
  mockTelegramEnv,
  retrieveLaunchParamsFp,
  retrieveRawLaunchParamsFp,
  isTMA
} from "@tma.js/bridge";
import * as E from "fp-ts/Either";
var TELEGRAM_ENV = {
  MOCK: {
    launchParams: {
      tgWebAppData: new URLSearchParams([
        [
          "user",
          JSON.stringify({
            id: 6666666666,
            first_name: "T",
            last_name: "yw",
            username: "ywwwtseng",
            language_code: "zh-hans",
            allows_write_to_pm: true,
            photo_url: "https://t.me/i/userpic/320/nQlDMwY_br5G4QK2sd9uK2yC7025mbODcLr8uHJWXX90vnZDywxIOKaH7vXai2FC.svg"
          })
        ],
        ["chat_instance", "-5440521606958638813"],
        ["chat_type", "sender"],
        ["auth_date", "1742711181"],
        [
          "signature",
          "FSFXaPVyWU5py8SyqrrstqPm59esA9zohIyPhn-nKJ9XQS47HeYtw5xnJ4SFy2G2fLFX7GQ5l7H4fxExGif8Aw"
        ],
        [
          "hash",
          "f2bc216132e681353f74476947e7cbdbc0afd05bbc53c790f829a11a1ac50883"
        ]
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
      const launchParams = E.getOrElse((err) => {
        console.error("\u932F\u8AA4:", err);
        return null;
      })(retrieveLaunchParamsFp());
      const initDataRaw = E.getOrElse(
        (err) => {
          console.error("\u932F\u8AA4:", err);
          return null;
        }
      )(retrieveRawLaunchParamsFp());
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
import { jsx } from "react/jsx-runtime";
var TMASDKContext = createContext(
  void 0
);
function TMASDKProvider({
  env,
  background = "#000000",
  children
}) {
  const { launchParams, initDataRaw } = useTelegramSDK(env);
  const user = launchParams?.tgWebAppData?.user;
  const platform = launchParams?.tgWebAppPlatform;
  const [avatar, setAvatar] = useState(null);
  const value = useMemo2(
    () => ({
      initDataRaw,
      user,
      platform,
      avatar
    }),
    [initDataRaw, user, platform, avatar]
  );
  useClientOnce(() => {
    if (env === TELEGRAM_ENV.DEFAULT && isTMA2()) {
      postEvent("web_app_set_header_color", { color: background });
      postEvent("web_app_set_bottom_bar_color", { color: background });
      postEvent("web_app_set_background_color", { color: background });
      postEvent("web_app_expand");
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
import {
  useMemo as useMemo3,
  useCallback,
  createContext as createContext2,
  use as use2
} from "react";
import { Request } from "@ywwwtseng/request";
import { jsx as jsx2 } from "react/jsx-runtime";
var TMAClientContext = createContext2(void 0);
function TMAClientProvider({ url, children }) {
  const { initDataRaw } = useTMASDK();
  const request = useMemo3(
    () => new Request({
      transformRequest(headers) {
        headers.set("Authorization", `tma ${initDataRaw}`);
        return headers;
      }
    }),
    [url, initDataRaw]
  );
  const query = useCallback(
    (path, params) => {
      path = Array.isArray(path) ? path : [path];
      return request.post(url, { type: "query", path, params });
    },
    [request]
  );
  const mutate = useCallback(
    (action, payload) => {
      return request.post(url, { type: "mutate", action, payload });
    },
    [request]
  );
  const value = useMemo3(
    () => ({
      query,
      mutate
    }),
    [query, mutate]
  );
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
import {
  createContext as createContext3,
  useRef,
  useCallback as useCallback2,
  useEffect as useEffect2,
  useMemo as useMemo4
} from "react";
import { create } from "zustand";
import { update, merge, get } from "@ywwwtseng/ywjs";
import { ToastContainer } from "react-toastify";
import { Fragment, jsx as jsx3, jsxs } from "react/jsx-runtime";
var TMAStoreContext = createContext3(
  void 0
);
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
          if ("update" in command) {
            store = {
              ...store,
              state: update(store.state, command.update, command.payload)
            };
          } else if ("merge" in command) {
            store = {
              ...store,
              state: update(
                store.state,
                command.merge,
                merge({}, get(store.state, command.merge), command.payload)
              )
            };
          }
        }
      }
      return store;
    });
  }
}));
function TMAStoreProvider({ children }) {
  const client = useTMAClient();
  const { update: update2 } = useTMAStore();
  const loadingRef = useRef([]);
  const query = useCallback2(
    (path, params = {}) => {
      const key = JSON.stringify(path);
      loadingRef.current.push(key);
      update2({
        update: ["loading"],
        payload: (store) => ({
          ...store,
          loading: [...store.loading, key]
        })
      });
      return client.query(path, params).then((res) => {
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
      }).catch((error) => {
        loadingRef.current = loadingRef.current.filter((k) => k !== key);
        update2({
          update: ["loading"],
          payload: (store) => ({
            ...store,
            loading: store.loading.filter((k) => k !== key)
          })
        });
        throw error;
      });
    },
    [client.query]
  );
  const mutate = useCallback2(
    (action, payload, options) => {
      const key = JSON.stringify({ action, payload });
      update2({
        update: ["loading"],
        payload: (store) => ({
          ...store,
          loading: [...store.loading, key]
        })
      });
      const optimistic = options?.optimistic;
      const execute = optimistic?.execute;
      if (execute) {
        update2(execute);
      }
      return client.mutate(action, payload).then((res) => {
        if (res.commands) {
          update2(res.commands);
        }
        return res;
      }).catch((error) => {
        const undo = optimistic?.undo;
        if (undo) {
          update2(undo);
        }
        throw error;
      });
    },
    [client.mutate]
  );
  useEffect2(() => {
    const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
    mutate("init", {
      timezone: resolvedOptions.timeZone,
      language_code: resolvedOptions.locale
    }).then(() => {
      update2({
        update: ["status"],
        payload: (store) => ({
          ...store,
          status: 1 /* Authenticated */
        })
      });
    }).catch((error) => {
      console.error(error);
      update2({
        update: ["status"],
        payload: (store) => ({
          ...store,
          status: 3 /* Forbidden */
        })
      });
    });
  }, [mutate]);
  const value = useMemo4(
    () => ({
      query,
      mutate,
      loadingRef
    }),
    [query, mutate, loadingRef]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx3(TMAStoreContext.Provider, { value, children }),
    /* @__PURE__ */ jsx3(
      ToastContainer,
      {
        closeOnClick: true,
        theme: "dark",
        closeButton: false,
        autoClose: 2400,
        hideProgressBar: true,
        position: "top-center"
      }
    )
  ] });
}

// src/store/TMAI18nContext.tsx
import {
  useCallback as useCallback3,
  useMemo as useMemo5,
  createContext as createContext4,
  use as use3
} from "react";
import { get as get3 } from "@ywwwtseng/ywjs";

// src/hooks/useStoreState.ts
import { get as get2 } from "@ywwwtseng/ywjs";
function useStoreState(path) {
  return useTMAStore((store) => get2(store.state, path));
}

// src/store/TMAI18nContext.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
var TMAI18nContext = createContext4(
  void 0
);
function TMAI18nProvider({ locales, children }) {
  const me = useStoreState("me");
  const t = useCallback3(
    (key, params) => {
      if (!locales) return key;
      const locale = locales?.[me?.language_code?.toLowerCase()?.slice(0, 2)] || locales[localStorage.getItem("language_code") || "en"];
      if (!locale || typeof key !== "string") return key;
      const template = get3(locale, key, key);
      if (!params) return template;
      return template.replace(
        /\{(\w+)\}/g,
        (_, key2) => String(params[key2]) || ""
      );
    },
    [me]
  );
  const value = useMemo5(
    () => ({
      t
    }),
    [t]
  );
  return /* @__PURE__ */ jsx4(TMAI18nContext.Provider, { value, children });
}
function useTMAI18n() {
  const context = use3(TMAI18nContext);
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
import { use as use4, useEffect as useEffect3, useRef as useRef2 } from "react";
import { get as get4 } from "@ywwwtseng/ywjs";
function useQuery(path, params = {}, options = {}) {
  const context = use4(TMAStoreContext);
  if (!context) {
    throw new Error("useQuery must be used within a TMA");
  }
  const { query, loadingRef } = context;
  const gcTimeRef = useRef2(options.gcTime || Infinity);
  const key = JSON.stringify(path);
  const isLoading = useTMAStore((store) => store.loading).includes(key);
  const data = useTMAStore((store) => get4(store.state, path));
  useEffect3(() => {
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
    query(path, params);
  }, [JSON.stringify(path), JSON.stringify(params)]);
  return {
    isLoading,
    data
  };
}

// src/hooks/useMutation.ts
import { use as use5, useState as useState2, useCallback as useCallback4 } from "react";
import { useRefValue } from "@ywwwtseng/react-kit";
import { toast } from "react-toastify";
function useMutation(action) {
  const context = use5(TMAStoreContext);
  const { t } = useTMAI18n();
  if (!context) {
    throw new Error("useMutation must be used within a TMA");
  }
  const [isLoading, setIsLoading] = useState2(false);
  const isLoadingRef = useRefValue(isLoading);
  const mutate = useCallback4(
    (payload, options) => {
      if (isLoadingRef.current) {
        return;
      }
      setIsLoading(true);
      return context.mutate(action, payload, options).then((res) => {
        if (res.notify) {
          toast[res.notify.type || "default"]?.(t(res.notify.message));
        }
        return res;
      }).catch((res) => {
        toast.error(t(res?.data?.error));
        throw res;
      }).finally(() => {
        setIsLoading(false);
      });
    },
    [context.mutate, action]
  );
  return {
    mutate,
    isLoading
  };
}

// src/components/Typography.tsx
import { Typography as ReactKitTypography } from "@ywwwtseng/react-kit";
import { jsx as jsx6 } from "react/jsx-runtime";
function Typography({ i18n, params, children, ...props }) {
  const { t } = useTMAI18n();
  return /* @__PURE__ */ jsx6(ReactKitTypography, { ...props, children: i18n ? t(i18n, params) : children });
}

// src/components/TMALayout.tsx
import {
  useState as useState4
} from "react";
import { createPortal } from "react-dom";
import {
  Layout,
  TabBar,
  useNavigate,
  useRoute
} from "@ywwwtseng/react-kit";

// src/components/TabBarItem.tsx
import { useState as useState3 } from "react";
import { isTMA as isTMA3, postEvent as postEvent2 } from "@tma.js/bridge";
import { jsx as jsx7, jsxs as jsxs2 } from "react/jsx-runtime";
function TabBarItem({
  icon,
  text,
  isActive = false,
  onClick,
  style
}) {
  const { t } = useTMAI18n();
  const [isActivating, setIsActivating] = useState3(false);
  return /* @__PURE__ */ jsxs2(
    "button",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        outline: "none",
        gap: "2px",
        width: "54px",
        color: isActive || isActivating ? "white" : "#7c7c7c",
        transition: "color 200ms",
        fontSize: "12px",
        whiteSpace: "nowrap",
        ...style
      },
      onClick: () => {
        if (isActive || isActivating) return;
        if (isTMA3()) {
          postEvent2("web_app_trigger_haptic_feedback", {
            type: "impact",
            impact_style: "light"
          });
        }
        setIsActivating(true);
        setTimeout(() => {
          setIsActivating(false);
        }, 200);
        onClick?.();
      },
      children: [
        /* @__PURE__ */ jsx7("div", { style: {
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 200ms",
          transformOrigin: "center",
          transform: isActivating ? "scale(1.1)" : "scale(1)"
        }, children: icon }),
        t(text)
      ]
    }
  );
}

// src/components/TMALayout.tsx
import { jsx as jsx8, jsxs as jsxs3 } from "react/jsx-runtime";
function TMALayout({
  headerLeft,
  headerRight,
  backIcon,
  backText = "Back",
  tabs = [],
  headerHeight = 56,
  tabBarHeight = 60,
  styles = {},
  children
}) {
  const route = useRoute();
  const navigate = useNavigate();
  const { status } = useTMAStore();
  const { platform } = useTMASDK();
  const [modal, setModal] = useState4(null);
  const safeAreaBottom = platform === "ios" ? 20 : 12;
  return /* @__PURE__ */ jsxs3(
    Layout.Root,
    {
      className: status !== 0 /* Loading */ ? "animate-fade-in" : "",
      style: styles?.root,
      children: [
        createPortal(
          /* @__PURE__ */ jsxs3(
            Layout.Header,
            {
              style: {
                ...styles?.header,
                height: headerHeight
              },
              children: [
                /* @__PURE__ */ jsxs3(Layout.HeaderLeft, { style: styles?.headerLeft, children: [
                  /* @__PURE__ */ jsx8(
                    "div",
                    {
                      className: "animate-fade-in",
                      style: {
                        display: route.type === "page" ? "block" : "none"
                      },
                      children: headerLeft ? typeof headerLeft === "function" ? headerLeft(route) : headerLeft : null
                    }
                  ),
                  /* @__PURE__ */ jsxs3(
                    "button",
                    {
                      className: "animate-fade-in",
                      style: {
                        display: route.type === "page" ? "none" : "flex",
                        alignItems: "center",
                        gap: "8px",
                        outline: "none",
                        background: "none",
                        border: "none"
                      },
                      onClick: () => navigate(-1),
                      children: [
                        backIcon && backIcon,
                        /* @__PURE__ */ jsx8(Typography, { size: "4", i18n: backText })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx8(Layout.HeaderRight, { style: styles?.headerRight, children: headerRight ? typeof headerRight === "function" ? headerRight(route) : headerRight : null })
              ]
            }
          ),
          document.body
        ),
        /* @__PURE__ */ jsx8(
          Layout.Main,
          {
            style: {
              ...styles?.main,
              paddingTop: headerHeight,
              paddingBottom: tabBarHeight + safeAreaBottom
            },
            children
          }
        ),
        /* @__PURE__ */ jsx8(
          TabBar,
          {
            style: {
              ...styles?.tabBar,
              height: tabBarHeight + safeAreaBottom
            },
            items: tabs,
            renderItem: (tab) => /* @__PURE__ */ jsx8(
              TabBarItem,
              {
                style: styles?.tabBarItem,
                icon: tab.icon,
                text: tab.title,
                isActive: tab.name === route.name,
                onClick: () => {
                  if (tab.modal) {
                    const Modal = tab.modal;
                    setModal(/* @__PURE__ */ jsx8(Modal, { open: true, onClose: () => setModal(null) }));
                  } else {
                    navigate(tab.name);
                  }
                }
              },
              tab.name
            )
          }
        ),
        modal
      ]
    }
  );
}

// src/components/Account.tsx
import { Canvas } from "@ywwwtseng/react-kit";
import { jsx as jsx9 } from "react/jsx-runtime";
function Avatar({
  style,
  size = 40
}) {
  const { avatar, user } = useTMASDK();
  if (avatar) {
    return /* @__PURE__ */ jsx9(
      Canvas,
      {
        className: "animate-fade-in flex items-center justify-center border border-border rounded-full",
        image: avatar,
        size,
        style
      }
    );
  }
  return /* @__PURE__ */ jsx9(
    "div",
    {
      className: "animate-fade-in flex items-center justify-center border border-border rounded-full",
      style: {
        width: size,
        height: size,
        ...style
      },
      children: /* @__PURE__ */ jsx9("span", { className: "text-lg font-semibold", children: user?.first_name?.[0] || "" })
    }
  );
}
var Account = {
  Avatar
};

// src/TMA.tsx
import { useCallback as useCallback5 } from "react";
import {
  StackNavigatorProvider,
  useNavigate as useNavigate2,
  useRoute as useRoute2,
  ScreenType
} from "@ywwwtseng/react-kit";
import { merge as merge2 } from "@ywwwtseng/ywjs";

// src/components/LaunchLaunchScreen.tsx
import { useEffect as useEffect4, useState as useState5, useRef as useRef3 } from "react";
import { jsx as jsx10 } from "react/jsx-runtime";
function LaunchLaunchScreen({
  children,
  duration = 2e3,
  onHide
}) {
  const startTime = useRef3(Date.now());
  const { status } = useTMAStore();
  const [hide, setHide] = useState5(false);
  useEffect4(() => {
    if (status === 0 /* Loading */) {
      return;
    }
    const delay = duration - (Date.now() - startTime.current);
    if (delay > 0) {
      setTimeout(() => {
        setHide(true);
        onHide?.();
      }, delay);
    } else {
      setHide(true);
      onHide?.();
    }
  }, [status]);
  return /* @__PURE__ */ jsx10(
    "div",
    {
      style: {
        backgroundColor: "black",
        zIndex: 2147483647,
        display: "flex",
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        opacity: hide ? 0 : 1,
        pointerEvents: hide ? "none" : "auto",
        transition: "opacity 0.3s ease-in-out"
      },
      children: /* @__PURE__ */ jsx10(
        "div",
        {
          style: {
            transform: "translateY(-27px)",
            display: "flex",
            gap: "8px",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          },
          children
        }
      )
    }
  );
}

// src/TMA.tsx
import { Fragment as Fragment2, jsx as jsx11, jsxs as jsxs4 } from "react/jsx-runtime";
function TMA({
  env,
  url,
  locales,
  launchScreen,
  screens,
  headerHeight = 56,
  tabBarHeight = 60,
  ...layoutProps
}) {
  const Layout2 = useCallback5(
    (props) => /* @__PURE__ */ jsx11(
      TMALayout,
      {
        ...props,
        ...layoutProps,
        styles: merge2(props.styles || {}, layoutProps.styles || {}),
        headerHeight,
        tabBarHeight
      }
    ),
    [layoutProps]
  );
  return /* @__PURE__ */ jsx11(TMAProvider, { env, url, locales, children: /* @__PURE__ */ jsxs4(Fragment2, { children: [
    /* @__PURE__ */ jsx11(
      StackNavigatorProvider,
      {
        layout: Layout2,
        screens,
        drawer: {
          style: {
            paddingTop: headerHeight
          }
        }
      }
    ),
    launchScreen && /* @__PURE__ */ jsx11(
      LaunchLaunchScreen,
      {
        onHide: () => {
          document.body.classList.add("loaded");
        },
        children: launchScreen
      }
    )
  ] }) });
}
export {
  Account,
  Avatar,
  ScreenType,
  TELEGRAM_ENV,
  TMA,
  TMAClientContext,
  TMAClientProvider,
  TMAI18nContext,
  TMAI18nProvider,
  TMALayout,
  TMAProvider,
  TMASDKContext,
  TMASDKProvider,
  TMAStoreContext,
  TMAStoreProvider,
  Typography,
  useMutation,
  useNavigate2 as useNavigate,
  useQuery,
  useRoute2 as useRoute,
  useStoreState,
  useTMAClient,
  useTMAI18n,
  useTMASDK,
  useTMAStore,
  useTelegramSDK
};
