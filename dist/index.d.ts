import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { PropsWithChildren, RefObject } from 'react';
import { User, Platform } from '@telegram-apps/sdk-react';
import { LaunchParamsLike } from '@telegram-apps/transformers';
import * as zustand from 'zustand';
import * as ReactKit from '@ywwwtseng/react-kit';

declare const TELEGRAM_ENV: {
    MOCK: {
        launchParams?: (Omit<LaunchParamsLike, 'tgWebAppData'> & {
            tgWebAppData?: string | URLSearchParams;
        }) | string | URLSearchParams;
    };
    DEFAULT: 0;
};
declare function useTelegramSDK(env?: typeof TELEGRAM_ENV[keyof typeof TELEGRAM_ENV]): {
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

interface TMASDKContextState {
    initDataRaw: string | null | undefined;
    user: User | undefined;
    platform: Platform | undefined;
    avatar: HTMLImageElement | null;
}
declare const TMASDKContext: react.Context<TMASDKContextState>;
interface TMASDKProviderProps extends PropsWithChildren {
    env?: typeof TELEGRAM_ENV[keyof typeof TELEGRAM_ENV];
    background?: `#${string}`;
}
declare function TMASDKProvider({ env, background, children, }: TMASDKProviderProps): react_jsx_runtime.JSX.Element;
declare function useTMASDK(): TMASDKContextState;

interface TMAClientContextState {
    query: (path: string | string[]) => Promise<unknown>;
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
    query: (path: string | string[]) => Promise<unknown>;
    mutate: (action: string, payload: unknown) => Promise<unknown>;
    loadingRef: RefObject<string[]>;
}
declare const TMAStoreContext: react.Context<TMAStoreContextState>;
interface TMAStoreProviderProps extends PropsWithChildren {
}
interface ResponseDataCommand {
    update?: string[];
    action?: string;
    payload: unknown;
}
interface ResponseData {
    commands: ResponseDataCommand[];
}
type Store = {
    status: Status;
    state: Record<string, unknown>;
    loading: string[];
    update: (commands: ResponseDataCommand | ResponseDataCommand[]) => void;
};
declare const useTMAStore: zustand.UseBoundStore<zustand.StoreApi<Store>>;
declare function TMAStoreProvider({ children }: TMAStoreProviderProps): react_jsx_runtime.JSX.Element;
declare function useTMAStoreQuery(): {
    query: (path: string | string[]) => Promise<unknown>;
    loadingRef: RefObject<string[]>;
};
declare function useTMAStoreMutate(): (action: string, payload: unknown) => Promise<unknown>;

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

interface UseQueryOptions {
    gcTime?: number;
}
declare function useQuery<T = unknown>(path: string | string[], options?: UseQueryOptions): {
    isLoading: boolean;
    data: T;
};

declare function useMutation<T = unknown>(): {
    mutate: (action: string, payload: T) => void;
    isLoading: boolean;
};

declare function useStore<T = unknown>(path: string | string[]): T;

declare const HEADER_HEIGHT = 56;
declare const TAB_BAR_HEIGHT = 60;
declare function Root({ children }: React.PropsWithChildren): react_jsx_runtime.JSX.Element;
declare function Header({ className, children }: React.PropsWithChildren<{
    className?: string;
}>): react_jsx_runtime.JSX.Element;
declare namespace Header {
    var Left: typeof HeaderLeft;
    var Right: typeof HeaderRight;
}
declare function HeaderLeft({ className, children }: React.PropsWithChildren<{
    className?: string;
}>): react_jsx_runtime.JSX.Element;
declare function HeaderRight({ className, children }: React.PropsWithChildren<{
    className?: string;
}>): react_jsx_runtime.JSX.Element;
declare function Main({ className, children }: React.PropsWithChildren<{
    className?: string;
}>): react_jsx_runtime.JSX.Element;
declare function TabBar({ className, children }: React.PropsWithChildren<{
    className?: string;
}>): react_jsx_runtime.JSX.Element;
declare namespace TabBar {
    var Item: typeof TabBarItem;
}
declare function TabBarItem({ className, icon: Icon, text, active, onClick, }: {
    className?: string;
    icon: React.ElementType;
    text: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}): react_jsx_runtime.JSX.Element;
declare const Layout: {
    Root: typeof Root;
    Header: typeof Header;
    Main: typeof Main;
    TabBar: typeof TabBar;
};

interface TypographyProps extends ReactKit.TypographyProps {
    i18n?: string;
    params?: Record<string, string | number>;
}
declare function Typography({ i18n, params, children, ...props }: TypographyProps): react_jsx_runtime.JSX.Element;

interface LanguageMenuProps {
    className?: string;
}
declare function LanguageMenu({ className }: LanguageMenuProps): react_jsx_runtime.JSX.Element;

export { HEADER_HEIGHT, LanguageMenu, Layout, type Locale, type Locales, type ResponseData, type ResponseDataCommand, Status, type Store, TAB_BAR_HEIGHT, TELEGRAM_ENV, TMAClientContext, type TMAClientContextState, TMAClientProvider, type TMAClientProviderProps, TMAI18nContext, type TMAI18nContextState, TMAI18nProvider, type TMAI18nProviderProps, TMAProvider, type TMAProviderProps, TMASDKContext, type TMASDKContextState, TMASDKProvider, type TMASDKProviderProps, TMAStoreContext, type TMAStoreContextState, TMAStoreProvider, type TMAStoreProviderProps, Typography, useMutation, useQuery, useStore, useTMAClient, useTMAI18n, useTMASDK, useTMAStore, useTMAStoreMutate, useTMAStoreQuery, useTelegramSDK };
