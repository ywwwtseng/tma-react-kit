import React from 'react';
import { TMASDKProvider, TMASDKProviderProps } from './TMASDKContext';

interface TMAProviderProps extends React.PropsWithChildren, Omit<TMASDKProviderProps, 'children'> {
  
};

export function TMAProvider({ env, background, children }: TMAProviderProps) {
  return (
    <TMASDKProvider env={env} background={background}>
      {children}
    </TMASDKProvider>
  );
}