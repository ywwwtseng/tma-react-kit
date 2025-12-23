import {
  useState,
  createContext,
  useEffect,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { useClient } from '@ywwwtseng/react-kit';
import { Status } from '../constants';

export interface TMAInitContextState {
  status: Status;
}

export const TMAInitContext = createContext<TMAInitContextState | undefined>(
  undefined
);

export type TMAInit = {
  status: Status;
};

export function TMAInitProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<Status>(Status.Loading);
  const client = useClient();

  useEffect(() => {
    const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();

    client.mutate('init', {
      timezone: resolvedOptions.timeZone,
      language_code: resolvedOptions.locale,
    })
      .then(() => {
        setStatus(Status.Authenticated);
      })
      .catch((error) => {
        console.error(error);
        setStatus(Status.Forbidden);
      });
  }, [client.mutate]);

  const value = useMemo(
    () => ({
      status,
    }),
    [status]
  );

  return (
    <TMAInitContext.Provider value={value}>
      {children}
    </TMAInitContext.Provider>
  );
}
