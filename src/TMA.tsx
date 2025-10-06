import { type ReactElement, useState } from 'react';
import {
  StackNavigatorProvider,
  StackNavigatorProviderProps,
  Navigator,
  useNavigate,
  useRoute,
  ScreenType,
} from '@ywwwtseng/react-kit';
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

  return (
    <>
      <StackNavigatorProvider screens={screens}>
        <TMAProvider env={env} url={url} locales={locales}>
          <TMALayout
            {...layoutProps}
            styles={layoutProps.styles}
            headerHeight={headerHeight}
            tabBarHeight={tabBarHeight}
          >
            <Navigator
              drawer={{
                style: {
                  paddingTop: headerHeight,
                  paddingBottom: 20,
                },
              }}
            />
          </TMALayout>
        </TMAProvider>
      </StackNavigatorProvider>
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
  );
}
