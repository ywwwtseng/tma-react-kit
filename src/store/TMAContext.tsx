import React from 'react';
import { TMASDKProvider, TMASDKProviderProps } from './TMASDKContext';
import { TMAClientProvider, TMAClientProviderProps} from './TMAClientContext';

interface TMAProviderProps extends
  React.PropsWithChildren,
  Omit<TMASDKProviderProps, 'children'>,
  Omit<TMAClientProviderProps, 'children'>
{

};

export function TMAProvider({ env, background, url, children }: TMAProviderProps) {
  return (
    <TMASDKProvider env={env} background={background}>
      <TMAClientProvider url={url}>
        {children}
      </TMAClientProvider>
    </TMASDKProvider>
  );
}