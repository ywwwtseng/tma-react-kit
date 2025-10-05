import { postEvent } from '@tma.js/bridge';

export function openTelegramLink(url: string | URL) {
  url = new URL(url);
  postEvent('web_app_open_tg_link', { path_full: url.pathname + url.search });
}
