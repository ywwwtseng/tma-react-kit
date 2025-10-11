import { postEvent } from '@tma.js/bridge';

export function openTelegramLink(url: string | URL) {
  try {
    url = new URL(url);
    void postEvent('web_app_open_tg_link', {
      path_full: url.pathname + url.search,
    });
  } catch (error) {
    console.error(error);
  }
}

export function openWebLink(url: string | URL) {
  try {
    url = new URL(url);
    void postEvent('web_app_open_link', { url: url.toString() });
  } catch (error) {
    console.error(error);
  }
}
