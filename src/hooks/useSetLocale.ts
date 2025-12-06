import { useCallback } from 'react';
import { useMutation } from './useMutation';

export function useSetLocale() {
  const { mutate } = useMutation('me:update');

  const setLocale = useCallback(
    (locale: string) => {
      void mutate({
        language_code: locale,
      });
    },
    [mutate]
  );

  return setLocale;
}
