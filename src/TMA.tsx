import { type ReactElement, useCallback, useMemo } from 'react';
import { StackNavigatorProvider, StackNavigatorProviderProps, useNavigate, useRoute, ScreenType } from '@ywwwtseng/react-kit';
import { merge } from '@ywwwtseng/utils';
import { TMAProvider, TMAProviderProps } from './store/TMAContext';
import { TMALayout, TMALayoutProps } from './components/TMALayout';
import { LaunchLaunchScreen } from './components/LaunchLaunchScreen';

export { useNavigate, useRoute, ScreenType };

export interface TMAProps
  extends TMAProviderProps,
    Omit<StackNavigatorProviderProps, 'layout' | 'drawer'>,
    Omit<TMALayoutProps, 'tabs'> {
  launchScreen?: ReactElement;
}

export function TMA({
  env,
  url,
  locales,
  launchScreen,
  screens,
  headerHeight = 56,
  tabBarHeight = 60,
  ...layoutProps
}: TMAProps) {
  const tabs = useMemo(
    () =>
      Object.entries(screens)
        .filter(([_, screen]) => screen.icon)
        .map(([name, screen]) => ({ name, title: screen.title, icon: screen.icon })),
    [screens]
  );
  const Layout = useCallback(
    (props: TMALayoutProps) => (
      <TMALayout
        {...props}
        {...layoutProps}
        tabs={tabs}
        styles={merge(props.styles || {}, layoutProps.styles || {})}
        headerHeight={headerHeight}
        tabBarHeight={tabBarHeight}
      />
    ),
    [layoutProps, tabs]
  );

  return (
    <TMAProvider env={env} url={url} locales={locales}>
      <>
        <StackNavigatorProvider
          layout={Layout}
          screens={screens}
          drawer={{
            style: {
              paddingTop: headerHeight,
            },
          }}
        />
        {launchScreen && (
          <LaunchLaunchScreen>{launchScreen}</LaunchLaunchScreen>
        )}
      </>
    </TMAProvider>
  );
}
