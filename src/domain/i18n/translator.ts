import { I18N } from './en';
import type { SupportedLang } from './keys';

export const DEFAULT_LANG: SupportedLang = 'es';

type Dict = Record<string, string>;

export function translate(lang: SupportedLang, key: string, fallback = ''): string {
  const dictionary: Dict = (I18N[lang] ?? I18N.en) as Dict;
  const english: Dict = I18N.en as Dict;
  return dictionary[key] ?? english[key] ?? fallback ?? key;
}
