import React from 'react';
import { TMASDKProvider, TMASDKProviderProps } from './TMASDKContext';
import { TMAClientProvider, TMAClientProviderProps} from './TMAClientContext';
import { TMAStateProvider, TMAStateProviderProps } from './TMAStateContext';
import { TMAI18nProvider, TMAI18nProviderProps } from './TMAI18nContext';

interface TMAProviderProps extends React.PropsWithChildren,
  Omit<TMASDKProviderProps, 'children'>,
  Omit<TMAClientProviderProps, 'children'>,
  Omit<TMAStateProviderProps, 'children'>,
  Omit<TMAI18nProviderProps, 'children'> {};

export function TMAProvider({ env, background, url, locales, children }: TMAProviderProps) {
  return (
    <TMASDKProvider env={env} background={background}>
      <TMAClientProvider url={url}>
        <TMAStateProvider>
          <TMAI18nProvider locales={locales}>
            {children}
          </TMAI18nProvider>
        </TMAStateProvider>
      </TMAClientProvider>
    </TMASDKProvider>
  );
}