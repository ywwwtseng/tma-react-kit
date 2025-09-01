import { LaunchParamsLike } from '@telegram-apps/transformers';
import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import { User, Platform } from '@telegram-apps/sdk-react';

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
declare const TMASDKContext: React.Context<TMASDKContextState>;
interface TMASDKProviderProps extends React.PropsWithChildren {
    env?: typeof TELEGRAM_ENV[keyof typeof TELEGRAM_ENV];
    background?: `#${string}`;
}
declare function TMASDKProvider({ env, background, children, }: TMASDKProviderProps): react_jsx_runtime.JSX.Element;
declare function useTMASDK(): TMASDKContextState;

interface TMAProviderProps extends React.PropsWithChildren, Omit<TMASDKProviderProps, 'children'> {
}
declare function TMAProvider({ env, background, children }: TMAProviderProps): react_jsx_runtime.JSX.Element;

declare const HEADER_HEIGHT = 56;
declare const TAB_BAR_HEIGHT = 60;
declare function Root({ children }: React.PropsWithChildren): react_jsx_runtime.JSX.Element;
declare function Header({ className, logo, children }: React.PropsWithChildren<{
    className?: string;
    logo: React.ReactElement;
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

export { HEADER_HEIGHT, Layout, TAB_BAR_HEIGHT, TELEGRAM_ENV, TMAProvider, TMASDKContext, type TMASDKContextState, TMASDKProvider, type TMASDKProviderProps, useTMASDK, useTelegramSDK };
