import { useCallback } from 'react';
import { useMutation } from './useMutation';
import { useTMAI18n } from '../store/TMAI18nContext';

export function useSetLocale() {
  const { mutate } = useMutation('me:update');
  const { language_code } = useTMAI18n();

  const setLocale = useCallback(
    (locale: string) => {
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
                payload: { language_code },
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
