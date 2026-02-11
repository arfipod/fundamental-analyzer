import { EN_DICT } from './en';
import { ES_DICT } from './es';
import type { SupportedLang, TranslationKey } from './keys';

const DICTS = { en: EN_DICT, es: ES_DICT } as const;

export const DEFAULT_LANG: SupportedLang = 'es';

export function translate(
  lang: SupportedLang,
  key: TranslationKey,
  fallback = ''
): string {
  return DICTS[lang][key] ?? EN_DICT[key] ?? (fallback || key);
}
