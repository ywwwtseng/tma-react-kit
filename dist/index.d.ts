import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { PropsWithChildren, ReactNode, ElementType, CSSProperties, ReactElement } from 'react';
import { LaunchParamsLike } from '@tma.js/transformers';
import { AppProviderProps, TypographyProps as TypographyProps$1, Route, Tab, StackNavigatorProviderProps } from '@ywwwtseng/react-kit';

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
    setupBackButton: (is_visible: boolean) => void;
}
declare const TMASDKContext: react.Context<TMASDKContextState>;
interface TMASDKProviderProps extends PropsWithChildren {
    env?: (typeof TELEGRAM_ENV)[keyof typeof TELEGRAM_ENV];
    background?: `#${string}`;
}
declare function TMASDKProvider({ env, background, children, }: TMASDKProviderProps): react_jsx_runtime.JSX.Element;
declare function useTMASDK(): TMASDKContextState;

interface TMAProviderProps extends React.PropsWithChildren, Omit<AppProviderProps, 'children'> {
}
declare function TMAProvider({ children, ...appProviderProps }: TMAProviderProps): react_jsx_runtime.JSX.Element;

declare function useShare(): ({ url, text }: {
    url: string;
    text: string;
}) => void;

declare function useBackButton(is_visible: boolean): void;

interface TypographyProps extends TypographyProps$1 {
    i18n?: string;
    params?: Record<string, string | number>;
}
declare function Typography({ i18n, params, children, ...props }: TypographyProps): react_jsx_runtime.JSX.Element;

interface TMALayoutProps extends PropsWithChildren {
    hideHeader?: boolean;
    headerLeft?: ReactNode | ((route: Route) => ReactNode);
    headerRight?: ReactNode | ((route: Route) => ReactNode);
    backIcon?: ReactNode;
    backText?: string;
    tabs?: (Tab & {
        modal?: ElementType;
    })[];
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
declare function TMALayout({ hideHeader, headerLeft, headerRight, backIcon, backText, tabs, styles, children, }: TMALayoutProps): react_jsx_runtime.JSX.Element;

declare function Avatar({ style, size, }: {
    style?: React.CSSProperties;
    size?: number;
}): react_jsx_runtime.JSX.Element;
declare const Account: {
    Avatar: typeof Avatar;
};

declare function openTelegramLink(url: string | URL): void;
declare function openWebLink(url: string | URL): void;

interface TMAProps extends Omit<TMASDKProviderProps, 'children'>, Omit<TMAProviderProps, 'children'>, Omit<StackNavigatorProviderProps, 'layout' | 'drawer' | 'children'> {
    launchScreen?: ReactElement;
    layoutProps?: TMALayoutProps;
    onLoaded?: () => void;
    children?: ReactElement;
}
declare function TMA({ env, background, launchScreen, screens, children, layoutProps, onLoaded, ...appProviderProps }: TMAProps): react_jsx_runtime.JSX.Element;

export { Account, Avatar, TELEGRAM_ENV, TMA, TMALayout, type TMALayoutProps, type TMAProps, TMAProvider, type TMAProviderProps, TMASDKContext, type TMASDKContextState, TMASDKProvider, type TMASDKProviderProps, Typography, type User, openTelegramLink, openWebLink, useBackButton, useShare, useTMASDK, useTelegramSDK };
