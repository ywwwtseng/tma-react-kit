import { type ReactElement, useState } from 'react';
import {
  StackNavigatorProvider,
  StackNavigatorProviderProps,
  StackView,
  useIsMounted
} from '@ywwwtseng/react-kit';
import { TMASDKProvider, TMASDKProviderProps } from './providers/TMASDKProvider';
import { TMAProvider, TMAProviderProps } from './providers/TMAProvider';
import { TMALayout, TMALayoutProps } from './components/TMALayout';
import { LaunchScreen } from './components/LaunchScreen';

export interface TMAProps
  extends 
    Omit<TMASDKProviderProps, 'children'>,
    Omit<TMAProviderProps, 'children'>,
    Omit<StackNavigatorProviderProps, 'layout' | 'drawer' | 'children'> {
  launchScreen?: ReactElement;
  layoutProps?: TMALayoutProps;
  onLoaded?: () => void;
  children?: ReactElement;
}

export function TMA({
  env,
  background,
  launchScreen,
  screens,
  children,
  layoutProps = {},
  onLoaded,
  ...appProviderProps
}: TMAProps) {
  const isMounted = useIsMounted();
  const [loaded, setLoaded] = useState(false);
  const hasTabs = !!layoutProps.tabs;

  if (!isMounted) {
    return null;
  }
  

  return (
    <StackNavigatorProvider screens={screens}>
      <TMASDKProvider env={env} background={background}>
        <TMAProvider {...appProviderProps}>
          <TMALayout {...layoutProps}>
            <StackView
              drawer={{
                style: hasTabs ? {
                    paddingTop: layoutProps.hideHeader ? 0 : 56,
                    paddingBottom: 20,
                  } : {},
              }}
            />
            {children}
            {launchScreen && !loaded && (
              <LaunchScreen
                onHide={() => {
                  setLoaded(true);
                  onLoaded?.();
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
