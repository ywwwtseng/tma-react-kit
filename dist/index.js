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
      return request.post(url, { type: "query", path, params });
    },
    [request]
  );
  const mutate = useCallback(
    (action, payload) => {
      if (payload instanceof FormData) {
        payload.append("mutation:type", "mutate");
        payload.append("mutation:action", action);
        return request.post(url, payload);
      }
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
import { produce } from "immer";
import { merge } from "@ywwwtseng/ywjs";
import { ToastContainer } from "react-toastify";
import { Fragment, jsx as jsx3, jsxs } from "react/jsx-runtime";
var TMAStoreContext = createContext3(
  void 0
);
var getQueryKey = (path, params) => {
  return Object.keys(params).length > 0 ? JSON.stringify({ path, params }) : path;
};
var useTMAStore = create((set) => ({
  status: 0 /* Loading */,
  state: {},
  loading: [],
  update: (commands) => {
    set((store) => {
      return produce(store, (draft) => {
        for (const command of commands) {
          if (typeof command.payload === "function") {
            return command.payload(draft);
          } else {
            if ("update" in command) {
              draft.state[command.update] = command.payload;
            } else if ("merge" in command) {
              draft.state[command.merge] = merge(
                draft.state[command.merge],
                command.payload
              );
            } else if ("replace" in command && typeof command.payload === "object" && "target" in command.payload && "data" in command.payload) {
              const { target, data } = command.payload;
              if (typeof target === "string" && typeof data === "object") {
                const state = draft.state[command.replace];
                if (Array.isArray(state)) {
                  const index = state.findIndex(
                    (item) => item[target] === data[target]
                  );
                  if (index !== -1) {
                    state[index] = data;
                  } else {
                    state.push(data);
                  }
                } else {
                }
              }
            } else if ("unshift" in command) {
              if (Array.isArray(draft.state[command.unshift])) {
                draft.state[command.unshift].unshift(
                  command.payload
                );
              } else if (!draft.state[command.unshift]) {
              }
            }
          }
        }
      });
    });
  }
}));
function TMAStoreProvider({ children }) {
  const client = useTMAClient();
  const { update } = useTMAStore();
  const loadingRef = useRef([]);
  const query = useCallback2(
    (path, params = {}) => {
      const key = getQueryKey(path, params);
      loadingRef.current.push(key);
      update([
        {
          update: "loading",
          payload: (draft) => {
            draft.loading.push(key);
          }
        }
      ]);
      return client.query(path, params).then((res) => {
        loadingRef.current = loadingRef.current.filter((k) => k !== key);
        update([
          ...res.commands,
          {
            update: "loading",
            payload: (draft) => {
              draft.loading = draft.loading.filter((k) => k !== key);
            }
          }
        ]);
        return res;
      }).catch((error) => {
        loadingRef.current = loadingRef.current.filter((k) => k !== key);
        update([
          {
            update: "loading",
            payload: (draft) => {
              draft.loading = draft.loading.filter((k) => k !== key);
            }
          }
        ]);
        throw error;
      });
    },
    [client.query]
  );
  const mutate = useCallback2(
    (action, payload, options) => {
      const optimistic = options?.optimistic;
      const execute = optimistic?.execute;
      if (execute) {
        update(execute);
      }
      return client.mutate(action, payload).then((res) => {
        if (res.commands) {
          update(res.commands);
        }
        return res;
      }).catch((error) => {
        const undo = optimistic?.undo;
        if (undo) {
          update(undo);
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
      update([
        {
          update: "status",
          payload: (draft) => {
            draft.status = 1 /* Authenticated */;
          }
        }
      ]);
    }).catch((error) => {
      console.error(error);
      update([
        {
          update: "status",
          payload: (draft) => {
            draft.status = 3 /* Forbidden */;
          }
        }
      ]);
    });
  }, [mutate]);
  const value = useMemo4(
    () => ({
      query,
      mutate,
      update,
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
import { getLocale, translate } from "@ywwwtseng/ywjs";

// src/hooks/useStoreState.ts
import { get } from "@ywwwtseng/ywjs";
function useStoreState(path) {
  return useTMAStore((store) => get(store.state, path));
}

// src/store/TMAI18nContext.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
var TMAI18nContext = createContext4(
  void 0
);
function TMAI18nProvider({
  locales,
  callback = "en",
  children
}) {
  const me = useStoreState("me");
  const languagec_ode = useMemo5(() => {
    return me?.language_code || localStorage.getItem("language_code") || callback;
  }, [me, callback]);
  const locale = useMemo5(() => {
    return getLocale(locales, languagec_ode, locales[callback]);
  }, [languagec_ode, callback]);
  const t = useCallback3(
    (key, params) => {
      if (!locales) return key;
      return translate(locale, key, params);
    },
    [locale]
  );
  const value = useMemo5(
    () => ({
      languagec_ode,
      t
    }),
    [locale, t]
  );
  return /* @__PURE__ */ jsx4(TMAI18nContext.Provider, { value, children });
}
function useTMAI18n() {
  const context = use3(TMAI18nContext);
  if (!context) {
    throw new Error("useTMAI18n must be used within a TMAI18nProvider");
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
function useQuery(path, params = {}, options = {}) {
  const context = use4(TMAStoreContext);
  if (!context) {
    throw new Error("useQuery must be used within a TMA");
  }
  const { query, loadingRef } = context;
  const gcTimeRef = useRef2(options.gcTime || Infinity);
  const key = getQueryKey(path, params);
  const isLoading = useTMAStore((store) => store.loading).includes(key);
  const data = useTMAStore((store) => store.state[key]);
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
  }, [key]);
  return {
    isLoading,
    data
  };
}

// src/hooks/useMutation.ts
import { use as use5, useState as useState2, useCallback as useCallback4 } from "react";
import { useRefValue } from "@ywwwtseng/react-kit";
import { toast } from "react-toastify";
function useMutation(action, { onError } = {}) {
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
      isLoadingRef.current = true;
      setIsLoading(true);
      return context.mutate(action, payload, options).then((res) => {
        if (res.notify) {
          toast[res.notify.type || "default"]?.(t(res.notify.message));
        }
        return res;
      }).catch((res) => {
        toast.error(t(res?.data?.message));
        onError?.(res);
        return {
          ok: false
        };
      }).finally(() => {
        isLoadingRef.current = false;
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

// src/hooks/useShare.ts
import { useCallback as useCallback5 } from "react";

// src/utils.ts
import { postEvent as postEvent2 } from "@tma.js/bridge";
function openTelegramLink(url) {
  url = new URL(url);
  postEvent2("web_app_open_tg_link", { path_full: url.pathname + url.search });
}

// src/hooks/useShare.ts
function useShare() {
  const { platform } = useTMASDK();
  return useCallback5(({ url, text }) => {
    const isWebOrDesktop = platform?.includes("web") || platform === "macos" || platform === "tdesktop";
    text = isWebOrDesktop ? `
${text}` : text;
    openTelegramLink(
      `https://t.me/share/url?` + new URLSearchParams({ url, text: text || "" }).toString().replace(/\+/g, "%20")
    );
  }, []);
}

// src/hooks/useSetLocale.ts
import { useCallback as useCallback6 } from "react";
function useSetLocale() {
  const { mutate } = useMutation("me:update");
  const setLocale = useCallback6(
    (locale) => {
      const prev = localStorage.getItem("language_code") || "en";
      localStorage.setItem("language_code", locale);
      void mutate(
        {
          language_code: locale
        },
        {
          optimistic: {
            execute: [
              {
                merge: "me",
                payload: { language_code: locale }
              }
            ],
            undo: [
              {
                merge: "me",
                payload: { language_code: prev }
              }
            ]
          }
        }
      );
    },
    [mutate]
  );
  return setLocale;
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
  useRoute,
  ScreenType
} from "@ywwwtseng/react-kit";

// src/components/TabBarItem.tsx
import { useState as useState3 } from "react";
import { isTMA as isTMA3, postEvent as postEvent3 } from "@tma.js/bridge";
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
          postEvent3("web_app_trigger_haptic_feedback", {
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
  headerLeft = (route) => route.type === ScreenType.PAGE ? /* @__PURE__ */ jsx8(Typography, { size: "6", weight: 500, i18n: route.title }) : void 0,
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
  const { platform } = useTMASDK();
  const [modal, setModal] = useState4(null);
  const safeAreaBottom = platform === "ios" ? 20 : 12;
  return /* @__PURE__ */ jsxs3(Layout.Root, { style: styles?.root, children: [
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
                    display: route.type === ScreenType.PAGE ? "block" : "none"
                  },
                  children: headerLeft ? typeof headerLeft === "function" ? headerLeft(route) : headerLeft : null
                }
              ),
              /* @__PURE__ */ jsxs3(
                "button",
                {
                  className: "animate-fade-in",
                  style: {
                    display: route.type === ScreenType.DRAWER ? "flex" : "none",
                    alignItems: "center",
                    gap: "8px",
                    outline: "none",
                    background: "none",
                    border: "none"
                  },
                  onClick: () => navigate(-1),
                  children: [
                    backIcon && backIcon,
                    /* @__PURE__ */ jsx8(Typography, { size: "2", i18n: backText })
                  ]
                }
              )
            ] }),
            route.title && route.type !== ScreenType.PAGE && /* @__PURE__ */ jsx8(Layout.HeaderTitle, { children: /* @__PURE__ */ jsx8(Typography, { size: "3", i18n: route.title, noWrap: true }) }),
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
  ] });
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

// src/lib.ts
import { toast as toast2 } from "react-toastify";

// src/TMA.tsx
import { useCallback as useCallback7, useState as useState6 } from "react";
import {
  StackNavigatorProvider,
  useNavigate as useNavigate2,
  useRoute as useRoute2,
  ScreenType as ScreenType2
} from "@ywwwtseng/react-kit";
import { merge as merge2 } from "@ywwwtseng/ywjs";

// src/components/LaunchScreen.tsx
import { useEffect as useEffect4, useRef as useRef3 } from "react";
import { jsx as jsx10 } from "react/jsx-runtime";
function LaunchScreen({
  children,
  duration = 2e3,
  onHide
}) {
  const startTime = useRef3(Date.now());
  const { status } = useTMAStore();
  useEffect4(() => {
    if (status === 0 /* Loading */) {
      return;
    }
    const delay = duration - (Date.now() - startTime.current);
    if (delay > 0) {
      setTimeout(() => {
        onHide?.();
      }, delay);
    } else {
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
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
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
  const [loaded, setLoaded] = useState6(false);
  const Layout2 = useCallback7(
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
            paddingTop: headerHeight,
            paddingBottom: 20
          }
        }
      }
    ),
    launchScreen && !loaded && /* @__PURE__ */ jsx11(
      LaunchScreen,
      {
        onHide: () => {
          document.body.classList.add("loaded");
          setLoaded(true);
        },
        children: launchScreen
      }
    )
  ] }) });
}
export {
  Account,
  Avatar,
  ScreenType2 as ScreenType,
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
  getQueryKey,
  toast2 as toast,
  useMutation,
  useNavigate2 as useNavigate,
  useQuery,
  useRoute2 as useRoute,
  useSetLocale,
  useShare,
  useStoreState,
  useTMAClient,
  useTMAI18n,
  useTMASDK,
  useTMAStore,
  useTelegramSDK
};
