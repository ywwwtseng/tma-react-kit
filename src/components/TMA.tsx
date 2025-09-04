import { type ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { TMAProvider, TMAProviderProps } from '../store/TMAContext';
import { TMALayout, TMALayoutProps } from './TMALayout';
import { LaunchLaunchScreen } from './LaunchLaunchScreen';

export interface TMAProps extends TMAProviderProps, TMALayoutProps {
  launchScreen?: ReactElement;
}

export function TMA({
  env,
  url,
  locales,
  launchScreen,
  ...props
}: TMAProps) {
  return (
    <TMAProvider env={env} url={url} locales={locales}>
      <MemoryRouter>
        <TMALayout
          {...props}
        />
        {launchScreen && (
          <LaunchLaunchScreen>{launchScreen}</LaunchLaunchScreen>
        )}
      </MemoryRouter>
    </TMAProvider>
  );
}
