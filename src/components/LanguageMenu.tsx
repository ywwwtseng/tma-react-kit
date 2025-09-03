import { Dropdown } from '@ywwwtseng/react-kit';
import { useStore } from '../hooks/useStore';
import { useTMAStoreMutate } from '../store/TMAStoreContext';

const icons = {
  en: (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 512 512"><mask id="a"><circle cx="256" cy="256" r="256" fill="#fff"/></mask><g mask="url(#a)"><path fill="#eee" d="m0 0 8 22-8 23v23l32 54-32 54v32l32 48-32 48v32l32 54-32 54v68l22-8 23 8h23l54-32 54 32h32l48-32 48 32h32l54-32 54 32h68l-8-22 8-23v-23l-32-54 32-54v-32l-32-48 32-48v-32l-32-54 32-54V0l-22 8-23-8h-23l-54 32-54-32h-32l-48 32-48-32h-32l-54 32L68 0H0z"/><path fill="#0052b4" d="M336 0v108L444 0Zm176 68L404 176h108zM0 176h108L0 68ZM68 0l108 108V0Zm108 512V404L68 512ZM0 444l108-108H0Zm512-108H404l108 108Zm-68 176L336 404v108z"/><path fill="#d80027" d="M0 0v45l131 131h45L0 0zm208 0v208H0v96h208v208h96V304h208v-96H304V0h-96zm259 0L336 131v45L512 0h-45zM176 336 0 512h45l131-131v-45zm160 0 176 176v-45L381 336h-45z"/></g></svg>
  ),
  zh: (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 512 512"><mask id="a"><circle cx="256" cy="256" r="256" fill="#fff"/></mask><g mask="url(#a)"><path fill="#d80027" d="M0 256 256 0h256v512H0z"/><path fill="#0052b4" d="M256 256V0H0v256z"/><path fill="#eee" d="m222.6 149.8-31.3 14.7 16.7 30.3-34-6.5-4.3 34.3-23.6-25.2-23.7 25.2-4.3-34.3-34 6.5 16.7-30.3-31.2-14.7 31.2-14.7-16.6-30.3 34 6.5 4.2-34.3 23.7 25.3L169.7 77l4.3 34.3 34-6.5-16.7 30.3z"/><circle cx="146.1" cy="149.8" r="47.7" fill="#0052b4"/><circle cx="146.1" cy="149.8" r="41.5" fill="#eee"/></g></svg>
  ),
};

const languages = [
  {
    key: 'en',
    name: 'English',
    icon: icons.en,
  },
  {
    key: 'zh',
    name: '中文',
    icon: icons.zh,
  },
];

interface LanguageMenuProps {
  className?: string;
}

export function LanguageMenu({ className }: LanguageMenuProps) {
  const settings = useStore<{ language_code: string }>('settings');
  const mutate = useTMAStoreMutate();

  const language = languages.find((language) => language.key === settings?.language_code || language.key === localStorage.getItem('language_code'));

  return (
    <Dropdown className={className} items={languages} onChange={(key) => {
      localStorage.setItem('language_code', key);
      mutate('update:settings', { language_code: key });
    }}>
      <button style={{ display: language ? 'block' : 'none' }}>
        {icons[language?.key as keyof typeof icons]}
      </button>
    </Dropdown>
  );
}