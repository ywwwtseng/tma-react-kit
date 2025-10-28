import { TMASDKProvider, TMASDKProviderProps } from './TMASDKContext';
import { TMAClientProvider } from './TMAClientContext';
import { TMAStoreProvider, TMAStoreProviderProps } from './TMAStoreContext';
import { TMAI18nProvider, TMAI18nProviderProps } from './TMAI18nContext';

export interface TMAProviderProps
  extends React.PropsWithChildren,
    Omit<TMASDKProviderProps, 'children'>,
    Omit<TMAStoreProviderProps, 'children'>,
    Omit<TMAI18nProviderProps, 'children'> {}

export function TMAProvider({
  env,
  background,
  locales,
  children,
}: TMAProviderProps) {
  return (
    <TMASDKProvider env={env} background={background}>
      <TMAClientProvider>
        <TMAStoreProvider>
          <TMAI18nProvider locales={locales}>{children}</TMAI18nProvider>
        </TMAStoreProvider>
      </TMAClientProvider>
    </TMASDKProvider>
  );
}
