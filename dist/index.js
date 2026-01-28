// src/providers/TMASDKProvider.tsx
import {
  useMemo as useMemo2,
  useState,
  useCallback,
  useEffect,
  createContext,
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
            id: 5699547696,
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
      if (typeof window !== "undefined") {
        Object.assign(env.launchParams, {
          tgWebAppStartParam: new URLSearchParams(location.search).get("startapp")
        });
      }
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

// src/providers/TMASDKProvider.tsx
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
  const setupBackButton = useCallback((is_visible) => {
    postEvent("web_app_setup_back_button", { is_visible });
  }, []);
  const value = useMemo2(
    () => ({
      initDataRaw,
      user,
      platform,
      avatar,
      setupBackButton
    }),
    [initDataRaw, user, platform, avatar, setupBackButton]
  );
  useClientOnce(() => {
    if (isTMA2()) {
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

// src/providers/TMAProvider.tsx
import { useCallback as useCallback2 } from "react";
import { AppProvider } from "@ywwwtseng/react-kit";

// src/providers/TMAInitProvider.tsx
import {
  useState as useState2,
  createContext as createContext2,
  useEffect as useEffect2,
  useMemo as useMemo3
} from "react";
import { useClient } from "@ywwwtseng/react-kit";
import { jsx as jsx2 } from "react/jsx-runtime";
var TMAInitContext = createContext2(
  void 0
);
function TMAInitProvider({ children }) {
  const [status, setStatus] = useState2(0 /* Loading */);
  const client = useClient();
  useEffect2(() => {
    const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
    client.mutate("init", {
      timezone: resolvedOptions.timeZone,
      language_code: resolvedOptions.locale
    }).then(() => {
      setStatus(1 /* Authenticated */);
    }).catch((error) => {
      console.error(error);
      setStatus(3 /* Forbidden */);
    });
  }, [client.mutate]);
  const value = useMemo3(
    () => ({
      status
    }),
    [status]
  );
  return /* @__PURE__ */ jsx2(TMAInitContext.Provider, { value, children });
}

// src/providers/TMAProvider.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var toasterProps = {
  position: "top-center",
  toastOptions: {
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff"
    }
  }
};
function TMAProvider({
  children,
  ...appProviderProps
}) {
  const { initDataRaw } = useTMASDK();
  const transformRequest = useCallback2(
    (headers) => {
      headers.set("Authorization", `tma ${initDataRaw}`);
      return headers;
    },
    [initDataRaw]
  );
  return /* @__PURE__ */ jsx3(
    AppProvider,
    {
      transformRequest,
      toasterProps,
      ...appProviderProps,
      children: /* @__PURE__ */ jsx3(TMAInitProvider, { children })
    }
  );
}

// src/hooks/useShare.ts
import { useCallback as useCallback3 } from "react";

// src/utils.ts
import { postEvent as postEvent2 } from "@tma.js/bridge";
function openTelegramLink(url) {
  try {
    url = new URL(url);
    void postEvent2("web_app_open_tg_link", {
      path_full: url.pathname + url.search
    });
  } catch (error) {
    console.error(error);
  }
}
function openWebLink(url) {
  try {
    url = new URL(url);
    void postEvent2("web_app_open_link", { url: url.toString() });
  } catch (error) {
    console.error(error);
  }
}

// src/hooks/useShare.ts
function useShare() {
  const { platform } = useTMASDK();
  return useCallback3(({ url, text }) => {
    const isWebOrDesktop = platform?.includes("web") || platform === "macos" || platform === "tdesktop";
    text = isWebOrDesktop ? `
${text}` : text;
    openTelegramLink(
      `https://t.me/share/url?` + new URLSearchParams({ url, text: text || "" }).toString().replace(/\+/g, "%20")
    );
  }, []);
}

// src/hooks/useBackButton.ts
import { useEffect as useEffect3 } from "react";
import { useNavigate } from "@ywwwtseng/react-kit";
import { isTMA as isTMA3, on } from "@tma.js/bridge";
function useBackButton(is_visible) {
  const navigate = useNavigate();
  const { setupBackButton } = useTMASDK();
  useEffect3(() => {
    if (isTMA3()) {
      setupBackButton(is_visible);
      const off = on("back_button_pressed", () => {
        navigate(-1);
      });
      return () => {
        off();
      };
    } else {
      if (typeof window !== "undefined") {
        window.navigate = navigate;
      }
    }
  }, [is_visible]);
}

// src/components/Typography.tsx
import {
  Typography as ReactKitTypography,
  useI18n
} from "@ywwwtseng/react-kit";
import { jsx as jsx4 } from "react/jsx-runtime";
function Typography({ i18n, params, children, ...props }) {
  const { t } = useI18n();
  return /* @__PURE__ */ jsx4(ReactKitTypography, { ...props, children: i18n ? t(i18n, params) : children });
}

// src/components/TMALayout.tsx
import {
  useState as useState4
} from "react";
import { createPortal } from "react-dom";
import {
  Layout,
  TabBar,
  useNavigate as useNavigate2,
  useRoute,
  ScreenType
} from "@ywwwtseng/react-kit";

// src/components/TabBarItem.tsx
import { useState as useState3 } from "react";
import { isTMA as isTMA4, postEvent as postEvent3 } from "@tma.js/bridge";
import { useI18n as useI18n2 } from "@ywwwtseng/react-kit";
import { jsx as jsx5, jsxs } from "react/jsx-runtime";
function TabBarItem({
  icon,
  text,
  isActive = false,
  onClick,
  style
}) {
  const { t } = useI18n2();
  const [isActivating, setIsActivating] = useState3(false);
  return /* @__PURE__ */ jsxs(
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
        if (isTMA4()) {
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
        /* @__PURE__ */ jsx5("div", { style: {
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
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
function TMALayout({
  hideHeader = false,
  headerLeft = (route) => route.type === ScreenType.PAGE ? /* @__PURE__ */ jsx6(Typography, { size: "6", weight: 500, i18n: route.title }) : void 0,
  headerRight,
  backIcon,
  backText = "Back",
  tabs,
  styles = {},
  children
}) {
  const route = useRoute();
  const navigate = useNavigate2();
  const { platform } = useTMASDK();
  const [modal, setModal] = useState4(null);
  const safeAreaBottom = platform === "ios" ? 20 : 12;
  const hasTabs = !!tabs;
  const tabBarHeight = hasTabs ? 60 : 0;
  const headerHeight = hideHeader ? 0 : 56;
  return /* @__PURE__ */ jsxs2(Layout.Root, { style: styles?.root, children: [
    !hideHeader && createPortal(
      /* @__PURE__ */ jsxs2(
        Layout.Header,
        {
          style: {
            ...styles?.header,
            height: headerHeight
          },
          children: [
            /* @__PURE__ */ jsxs2(Layout.HeaderLeft, { style: styles?.headerLeft, children: [
              /* @__PURE__ */ jsx6(
                "div",
                {
                  className: "animate-fade-in",
                  style: {
                    display: route.type === ScreenType.PAGE ? "block" : "none"
                  },
                  children: headerLeft ? typeof headerLeft === "function" ? headerLeft(route) : headerLeft : null
                }
              ),
              /* @__PURE__ */ jsxs2(
                "button",
                {
                  className: "animate-fade-in",
                  style: {
                    display: route.type === ScreenType.DRAWER || route.back ? "flex" : "none",
                    alignItems: "center",
                    gap: "8px",
                    outline: "none",
                    background: "none",
                    border: "none"
                  },
                  onClick: () => {
                    if (route.back) {
                      const push = route.back.push;
                      const replace = route.back.replace;
                      if (push) {
                        navigate(push, { type: "push" });
                      } else if (replace) {
                        navigate(replace, { type: "replace" });
                      }
                    } else {
                      navigate(-1);
                    }
                  },
                  children: [
                    backIcon && backIcon,
                    /* @__PURE__ */ jsx6(Typography, { size: "2", i18n: route.back?.title ?? backText })
                  ]
                }
              )
            ] }),
            route.title && route.type !== ScreenType.PAGE && /* @__PURE__ */ jsx6(Layout.HeaderTitle, { children: /* @__PURE__ */ jsx6(Typography, { size: "3", i18n: route.title, noWrap: true }) }),
            /* @__PURE__ */ jsx6(Layout.HeaderRight, { style: styles?.headerRight, children: headerRight ? typeof headerRight === "function" ? headerRight(route) : headerRight : null })
          ]
        }
      ),
      document.body
    ),
    /* @__PURE__ */ jsx6(
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
    hasTabs && /* @__PURE__ */ jsx6(
      TabBar,
      {
        style: {
          ...styles?.tabBar,
          height: tabBarHeight + safeAreaBottom,
          display: route.type === ScreenType.PAGE ? "flex" : "none"
        },
        items: tabs,
        renderItem: (tab) => /* @__PURE__ */ jsx6(
          TabBarItem,
          {
            style: styles?.tabBarItem,
            icon: tab.icon,
            text: tab.title,
            isActive: tab.name === route.name,
            onClick: () => {
              if (tab.modal) {
                const Modal = tab.modal;
                setModal(/* @__PURE__ */ jsx6(Modal, { open: true, onClose: () => setModal(null) }));
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
import { jsx as jsx7 } from "react/jsx-runtime";
function Avatar({
  style,
  size = 40
}) {
  const { avatar, user } = useTMASDK();
  if (avatar) {
    return /* @__PURE__ */ jsx7(
      Canvas,
      {
        className: "animate-fade-in flex items-center justify-center border border-border rounded-full",
        image: avatar,
        size,
        style
      }
    );
  }
  return /* @__PURE__ */ jsx7(
    "div",
    {
      className: "animate-fade-in flex items-center justify-center border border-border rounded-full",
      style: {
        width: size,
        height: size,
        ...style
      },
      children: /* @__PURE__ */ jsx7("span", { className: "text-lg font-semibold", children: user?.first_name?.[0] || "" })
    }
  );
}
var Account = {
  Avatar
};

// src/TMA.tsx
import { useState as useState5 } from "react";
import {
  StackNavigatorProvider,
  StackView,
  useIsMounted
} from "@ywwwtseng/react-kit";

// src/components/LaunchScreen.tsx
import { useEffect as useEffect4, useRef, use as use2 } from "react";
import { jsx as jsx8 } from "react/jsx-runtime";
function LaunchScreen({
  children,
  duration = 2e3,
  onHide
}) {
  const startTime = useRef(Date.now());
  const { status } = use2(TMAInitContext);
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
  return /* @__PURE__ */ jsx8(
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
      children: /* @__PURE__ */ jsx8(
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
import { jsx as jsx9, jsxs as jsxs3 } from "react/jsx-runtime";
function TMA({
  env,
  background,
  launchScreen,
  screens,
  children,
  layoutProps = {},
  onLoaded,
  ...appProviderProps
}) {
  const isMounted = useIsMounted();
  const [loaded, setLoaded] = useState5(false);
  const hasTabs = !!layoutProps.tabs;
  if (!isMounted) {
    return null;
  }
  return /* @__PURE__ */ jsx9(StackNavigatorProvider, { screens, children: /* @__PURE__ */ jsx9(TMASDKProvider, { env, background, children: /* @__PURE__ */ jsx9(TMAProvider, { ...appProviderProps, children: /* @__PURE__ */ jsxs3(TMALayout, { ...layoutProps, children: [
    /* @__PURE__ */ jsx9(
      StackView,
      {
        drawer: {
          style: hasTabs ? {
            paddingTop: layoutProps.hideHeader ? 0 : 56,
            paddingBottom: 20
          } : {}
        }
      }
    ),
    children,
    launchScreen && !loaded && /* @__PURE__ */ jsx9(
      LaunchScreen,
      {
        onHide: () => {
          setLoaded(true);
          onLoaded?.();
        },
        children: launchScreen
      }
    )
  ] }) }) }) });
}
export {
  Account,
  Avatar,
  TELEGRAM_ENV,
  TMA,
  TMALayout,
  TMAProvider,
  TMASDKContext,
  TMASDKProvider,
  Typography,
  openTelegramLink,
  openWebLink,
  useBackButton,
  useShare,
  useTMASDK,
  useTelegramSDK
};
