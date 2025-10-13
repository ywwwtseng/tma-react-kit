import { useCallback } from 'react';
import { useMutation } from './useMutation';

export function useSetLocale() {
  const { mutate } = useMutation('me:update');

  const setLocale = useCallback(
    (locale: string) => {
      const prev = localStorage.getItem('language_code') || 'en';
      localStorage.setItem('language_code', locale);

      void mutate(
        {
          language_code: locale,
        },
        {
          optimistic: {
            execute: [
              {
                type: 'merge',
                target: 'me',
                payload: { language_code: locale },
              },
            ],
            undo: [
              {
                type: 'merge',
                target: 'me',
                payload: { language_code: prev },
              },
            ],
          },
        }
      );
    },
    [mutate]
  );

  return setLocale;
}
