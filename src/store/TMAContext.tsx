import { useCallback } from 'react';
import { AppProvider, AppProviderProps } from '@ywwwtseng/react-kit';
import { TMAInitProvider } from './TMAInitContext';
import { useTMASDK } from './TMASDKContext';

export interface TMAProviderProps
  extends React.PropsWithChildren,
    Omit<AppProviderProps, 'children'> {}

const toasterProps = {
  position: 'top-center',
  toastOptions: {
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  },
} as const;

export function TMAProvider({
  children,
  ...appProviderProps
}: TMAProviderProps) {
  const { initDataRaw } = useTMASDK();

  const transformRequest = useCallback(
    (headers: Headers) => {
      headers.set('Authorization', `tma ${initDataRaw}`);
      return headers;
    },
    [initDataRaw]
  );

  return (
      <AppProvider
        transformRequest={transformRequest}
        toasterProps={toasterProps}
        {...appProviderProps}
      >
        <TMAInitProvider>
          {children}
        </TMAInitProvider>
      </AppProvider>
  );
}
