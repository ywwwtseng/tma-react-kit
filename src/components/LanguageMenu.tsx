import React from 'react';
import { Dropdown } from '@ywwwtseng/react-kit';
import { useStore } from '../hooks/useStore';
import { useTMAStoreMutate } from '../store/TMAStoreContext';

const languages = [
  {
    key: 'en',
    name: 'English',
    icon: 'https://hatscripts.github.io/circle-flags/flags/gb.svg',
  },
  {
    key: 'zh',
    name: '中文',
    icon: 'https://hatscripts.github.io/circle-flags/flags/tw.svg',
  },
];

export function LanguageMenu() {
  const settings = useStore<{ language_code: string }>('settings');
  const mutate = useTMAStoreMutate();

  const language = languages.find((language) => language.key === settings?.language_code || language.key === localStorage.getItem('language_code'));

  return (
    <Dropdown items={languages} onChange={(key) => {
      localStorage.setItem('language_code', key);
      mutate('update:settings', { language_code: key });
    }}>
      <button style={{ display: language ? 'block' : 'none' }}>
        <img src={language?.icon} width="40" height="40" alt={language?.name} />
      </button>
    </Dropdown>
  );
}