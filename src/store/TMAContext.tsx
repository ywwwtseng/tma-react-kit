import { TMASDKProvider, TMASDKProviderProps } from './TMASDKContext';
import { TMAClientProvider, TMAClientProviderProps} from './TMAClientContext';
import { TMAStoreProvider, TMAStoreProviderProps } from './TMAStoreContext';
import { TMAI18nProvider, TMAI18nProviderProps } from './TMAI18nContext';

interface TMAProviderProps extends React.PropsWithChildren,
  Omit<TMASDKProviderProps, 'children'>,
  Omit<TMAClientProviderProps, 'children'>,
  Omit<TMAStoreProviderProps, 'children'>,
  Omit<TMAI18nProviderProps, 'children'> {};

export function TMAProvider({ env, background, url, locales, children }: TMAProviderProps) {
  return (
    <TMASDKProvider env={env} background={background}>
      <TMAClientProvider url={url}>
        <TMAStoreProvider>
          <TMAI18nProvider locales={locales}>
            {children}
          </TMAI18nProvider>
        </TMAStoreProvider>
      </TMAClientProvider>
    </TMASDKProvider>
  );
}