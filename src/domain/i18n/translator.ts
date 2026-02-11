import { I18N } from './en';
import type { SupportedLang, TranslationKey } from './keys';

export const DEFAULT_LANG: SupportedLang = 'es';

export function translate(lang: SupportedLang, key: TranslationKey | string, fallback = ''): string {
  const dictionary = I18N[lang] ?? I18N.en;
  return dictionary[key] ?? I18N.en[key] ?? fallback || key;
}
