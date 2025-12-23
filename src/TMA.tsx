import { type ReactElement, useState } from 'react';
import {
  StackNavigatorProvider,
  StackNavigatorProviderProps,
  Navigator,
} from '@ywwwtseng/react-kit';
import { TMASDKProvider, TMASDKProviderProps } from './store/TMASDKContext';
import { TMAProvider, TMAProviderProps } from './store/TMAContext';
import { TMALayout, TMALayoutProps } from './components/TMALayout';
import { LaunchScreen } from './components/LaunchScreen';

export interface TMAProps
  extends 
    Omit<TMASDKProviderProps, 'children'>,
    Omit<TMAProviderProps, 'children'>,
    Omit<StackNavigatorProviderProps, 'layout' | 'drawer'> {
  launchScreen?: ReactElement;
  children?: ReactElement;
  layoutProps?: TMALayoutProps;
}

export function TMA({
  env,
  background,
  launchScreen,
  screens,
  children,
  layoutProps = {},
  ...appProviderProps
}: TMAProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <StackNavigatorProvider screens={screens}>
      <TMASDKProvider env={env} background={background}>
        <TMAProvider {...appProviderProps}>
          <TMALayout
            styles={layoutProps.styles}
            headerHeight={layoutProps.headerHeight ?? 56}
            tabBarHeight={layoutProps.tabBarHeight ?? 60}
            {...layoutProps}
          >
            <Navigator
              drawer={{
                style: {
                  paddingTop: layoutProps.headerHeight ?? 56,
                  paddingBottom: 20,
                },
              }}
            />
            {children}
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
          </TMALayout>
        </TMAProvider>
      </TMASDKProvider>
    </StackNavigatorProvider>
  );
}
