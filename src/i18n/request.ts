import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

async function loadMessages(locale: string) {
  try { return (await import(`../../messages/${locale}/common.json`)).default; }
  catch { return {}; }
}
function deepMerge(base: any, over: any): any {
  if (!over) return base;
  const out: any = { ...base };
  for (const k of Object.keys(over)) {
    out[k] = over[k] && typeof over[k] === 'object' && !Array.isArray(over[k])
      ? deepMerge(base?.[k] ?? {}, over[k]) : over[k];
  }
  return out;
}
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) locale = routing.defaultLocale;
  const base = await loadMessages('en');
  const localized = await loadMessages(locale);
  return { locale, messages: deepMerge(base, localized), timeZone: 'Europe/Paris' };
});
