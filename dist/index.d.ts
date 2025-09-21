import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { PropsWithChildren, RefObject, ReactNode, ElementType, CSSProperties, ReactElement } from 'react';
import { LaunchParamsLike } from '@tma.js/transformers';
import * as zustand from 'zustand';
import { TypographyProps as TypographyProps$1, Route, Tab, StackNavigatorProviderProps } from '@ywwwtseng/react-kit';
export { ScreenType, useNavigate, useRoute } from '@ywwwtseng/react-kit';

declare const TELEGRAM_ENV: {
    MOCK: {
        launchParams?: (Omit<LaunchParamsLike, 'tgWebAppData'> & {
            tgWebAppData?: string | URLSearchParams;
        }) | string | URLSearchParams;
    };
    DEFAULT: 0;
};
declare function useTelegramSDK(env?: (typeof TELEGRAM_ENV)[keyof typeof TELEGRAM_ENV]): {
    launchParams: {
        tgWebAppBotInline?: boolean;
        tgWebAppData?: {
            auth_date: Date;
            can_send_after?: number;
            chat?: {
                id: number;
                photo_url?: string;
                type: string;
                title: string;
                username?: string;
            } & {
                [key: string]: unknown;
            };
            chat_type?: string;
            chat_instance?: string;
            hash: string;
            query_id?: string;
            receiver?: {
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
            start_param?: string;
            signature: string;
            user?: {
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
        } & {
            [key: string]: unknown;
        };
        tgWebAppDefaultColors?: {
            accent_text_color?: `#${string}`;
            bg_color?: `#${string}`;
            button_color?: `#${string}`;
            button_text_color?: `#${string}`;
            bottom_bar_bg_color?: `#${string}`;
            destructive_text_color?: `#${string}`;
            header_bg_color?: `#${string}`;
            hint_color?: `#${string}`;
            link_color?: `#${string}`;
            secondary_bg_color?: `#${string}`;
            section_bg_color?: `#${string}`;
            section_header_text_color?: `#${string}`;
            section_separator_color?: `#${string}`;
            subtitle_text_color?: `#${string}`;
            text_color?: `#${string}`;
        };
        tgWebAppFullscreen?: boolean;
        tgWebAppPlatform: string;
        tgWebAppShowSettings?: boolean;
        tgWebAppStartParam?: string;
        tgWebAppThemeParams: {
            accent_text_color?: `#${string}`;
            bg_color?: `#${string}`;
            button_color?: `#${string}`;
            button_text_color?: `#${string}`;
            bottom_bar_bg_color?: `#${string}`;
            destructive_text_color?: `#${string}`;
            header_bg_color?: `#${string}`;
            hint_color?: `#${string}`;
            link_color?: `#${string}`;
            secondary_bg_color?: `#${string}`;
            section_bg_color?: `#${string}`;
            section_header_text_color?: `#${string}`;
            section_separator_color?: `#${string}`;
            subtitle_text_color?: `#${string}`;
            text_color?: `#${string}`;
        };
        tgWebAppVersion: string;
    } & {
        [key: string]: unknown;
    };
    initDataRaw: string;
};

type User = {
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
interface TMASDKContextState {
    initDataRaw: string | null | undefined;
    user: User | undefined;
    platform: string | undefined;
    avatar: HTMLImageElement | null;
}
declare const TMASDKContext: react.Context<TMASDKContextState>;
interface TMASDKProviderProps extends PropsWithChildren {
    env?: (typeof TELEGRAM_ENV)[keyof typeof TELEGRAM_ENV];
    background?: `#${string}`;
}
declare function TMASDKProvider({ env, background, children, }: TMASDKProviderProps): react_jsx_runtime.JSX.Element;
declare function useTMASDK(): TMASDKContextState;

interface TMAClientContextState {
    query: (path: string | string[], params: Record<string, string | number | boolean>) => Promise<unknown>;
    mutate: <TPayload>(action: string, payload: TPayload) => Promise<unknown>;
}
declare const TMAClientContext: react.Context<TMAClientContextState>;
interface TMAClientProviderProps extends PropsWithChildren {
    url: string;
}
declare function TMAClientProvider({ url, children }: TMAClientProviderProps): react_jsx_runtime.JSX.Element;
declare function useTMAClient(): TMAClientContextState;

declare enum Status {
    Loading = 0,
    Authenticated = 1,
    Unauthenticated = 2,
    Forbidden = 3
}

interface TMAStoreContextState {
    query: (path: string | string[], params: Record<string, string | number | boolean>) => Promise<unknown>;
    mutate: (action: string, payload: unknown, options?: MutateOptions) => Promise<unknown>;
    loadingRef: RefObject<string[]>;
}
declare const TMAStoreContext: react.Context<TMAStoreContextState>;
interface TMAStoreProviderProps extends PropsWithChildren {
}
interface Command {
    update?: string | string[];
    merge?: string | string[];
    payload: unknown;
}
interface MutateOptions {
    optimistic?: {
        execute: Command[];
        undo?: Command[];
    };
}
interface ResponseData {
    commands?: Command[];
    error?: string;
    ok?: boolean;
}
type Store = {
    status: Status;
    state: Record<string, unknown>;
    loading: string[];
    update: (commands: Command | Command[]) => void;
};
declare const useTMAStore: zustand.UseBoundStore<zustand.StoreApi<Store>>;
declare function TMAStoreProvider({ children }: TMAStoreProviderProps): react_jsx_runtime.JSX.Element;

interface TMAI18nContextState {
    t: (key: string, params?: Record<string, string | number>) => string;
}
declare const TMAI18nContext: react.Context<TMAI18nContextState>;
type Locale = Record<string, Record<string, string>>;
type Locales = Record<string, Locale>;
interface TMAI18nProviderProps extends PropsWithChildren {
    locales?: Locales;
}
declare function TMAI18nProvider({ locales, children }: TMAI18nProviderProps): react_jsx_runtime.JSX.Element;
declare function useTMAI18n(): TMAI18nContextState;

interface TMAProviderProps extends React.PropsWithChildren, Omit<TMASDKProviderProps, 'children'>, Omit<TMAClientProviderProps, 'children'>, Omit<TMAStoreProviderProps, 'children'>, Omit<TMAI18nProviderProps, 'children'> {
}
declare function TMAProvider({ env, background, url, locales, children }: TMAProviderProps): react_jsx_runtime.JSX.Element;

declare function useStoreState<T = unknown>(path: string | string[]): T | undefined;

type UseQueryParams = Record<string, string | number | boolean>;
interface UseQueryOptions {
    gcTime?: number;
}
declare function useQuery<T = unknown>(path: string | string[], params?: UseQueryParams, options?: UseQueryOptions): {
    isLoading: boolean;
    data: T | undefined;
};

declare function useMutation(): {
    mutate: <T = unknown>(action: string, payload?: T, options?: MutateOptions) => Promise<ResponseData>;
    isLoading: boolean;
};

interface TypographyProps extends TypographyProps$1 {
    i18n?: string;
    params?: Record<string, string | number>;
}
declare function Typography({ i18n, params, children, ...props }: TypographyProps): react_jsx_runtime.JSX.Element;

interface TMALayoutProps extends PropsWithChildren {
    headerLeft: ReactNode | ((route: Route) => ReactNode);
    headerRight: ReactNode | ((route: Route) => ReactNode);
    backIcon?: ReactNode;
    backText?: string;
    tabs?: (Tab & {
        modal?: ElementType;
    })[];
    headerHeight?: number;
    tabBarHeight?: number;
    styles?: {
        root?: CSSProperties;
        header?: CSSProperties;
        headerLeft?: CSSProperties;
        headerRight?: CSSProperties;
        main?: CSSProperties;
        tabBar?: CSSProperties;
        tabBarItem?: CSSProperties;
    };
}
declare function TMALayout({ headerLeft, headerRight, backIcon, backText, tabs, headerHeight, tabBarHeight, styles, children, }: TMALayoutProps): react_jsx_runtime.JSX.Element;

declare function Avatar({ style, size, }: {
    style?: React.CSSProperties;
    size?: number;
}): react_jsx_runtime.JSX.Element;
declare const Account: {
    Avatar: typeof Avatar;
};

interface TMAProps extends TMAProviderProps, TMALayoutProps, Omit<StackNavigatorProviderProps, 'layout' | 'drawer'> {
    launchScreen?: ReactElement;
}
declare function TMA({ env, url, locales, launchScreen, screens, headerHeight, tabBarHeight, ...layoutProps }: TMAProps): react_jsx_runtime.JSX.Element;

export { Account, Avatar, type Command, type Locale, type Locales, type MutateOptions, type ResponseData, type Store, TELEGRAM_ENV, TMA, TMAClientContext, type TMAClientContextState, TMAClientProvider, type TMAClientProviderProps, TMAI18nContext, type TMAI18nContextState, TMAI18nProvider, type TMAI18nProviderProps, TMALayout, type TMALayoutProps, type TMAProps, TMAProvider, type TMAProviderProps, TMASDKContext, type TMASDKContextState, TMASDKProvider, type TMASDKProviderProps, TMAStoreContext, type TMAStoreContextState, TMAStoreProvider, type TMAStoreProviderProps, Typography, type User, useMutation, useQuery, useStoreState, useTMAClient, useTMAI18n, useTMASDK, useTMAStore, useTelegramSDK };
