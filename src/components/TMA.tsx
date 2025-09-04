import { MemoryRouter } from 'react-router-dom';
import { TMAProvider, TMAProviderProps } from '../store/TMAContext';
import { TMALayout, TMALayoutProps } from './TMALayout';

export interface TMAProps extends TMAProviderProps, TMALayoutProps {
}

export function TMA({
  backIcon,
  backText,
  headerLeft,
  headerRight,
  env,
  url,
  locales,
  views = [],
}: TMAProps) {
  return (
    <TMAProvider env={env} url={url} locales={locales}>
      <MemoryRouter>
        <TMALayout
          backIcon={backIcon}
          backText={backText}
          headerLeft={headerLeft}
          headerRight={headerRight}
          views={views}
        />
      </MemoryRouter>
    </TMAProvider>
  );
}
