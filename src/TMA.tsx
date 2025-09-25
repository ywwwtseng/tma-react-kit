import { type ReactElement, useCallback, useState } from 'react';
import {
  StackNavigatorProvider,
  StackNavigatorProviderProps,
  useNavigate,
  useRoute,
  ScreenType,
} from '@ywwwtseng/react-kit';
import { merge } from '@ywwwtseng/ywjs';
import { TMAProvider, TMAProviderProps } from './store/TMAContext';
import { TMALayout, TMALayoutProps } from './components/TMALayout';
import { LaunchScreen } from './components/LaunchScreen';

export { useNavigate, useRoute, ScreenType };

export interface TMAProps
  extends TMAProviderProps,
    TMALayoutProps,
    Omit<StackNavigatorProviderProps, 'layout' | 'drawer'> {
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
  const [loaded, setLoaded] = useState(false);
  const Layout = useCallback(
    (props: TMALayoutProps) => (
      <TMALayout
        {...props}
        {...layoutProps}
        styles={merge(props.styles || {}, layoutProps.styles || {})}
        headerHeight={headerHeight}
        tabBarHeight={tabBarHeight}
      />
    ),
    [layoutProps]
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
              paddingBottom: 20,
            },
          }}
        />
        {launchScreen && !loaded && (
          <LaunchScreen
            onHide={() => {
              document.body.classList.add('loaded');
              setLoaded(true);
            }}
          >
            {launchScreen}
          </LaunchScreen>
        )}
      </>
    </TMAProvider>
  );
}
