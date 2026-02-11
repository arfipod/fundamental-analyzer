import { useMemo, useState } from 'react';
import type { TranslationKey } from '../../domain/i18n/keys';
import { translate } from '../../domain/i18n/translator';
import { LANGUAGE_KEY } from '../../infrastructure/storage/localStorage';

export function useI18n() {
  const [lang, setLang] = useState<'es' | 'en'>(
    localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'es'
  );

  const t = useMemo(
    () => (key: TranslationKey, fallback = '') => translate(lang, key, fallback),
    [lang]
  );

  const changeLanguage = (value: string) => {
    const normalized = value === 'en' ? 'en' : 'es';
    localStorage.setItem(LANGUAGE_KEY, normalized);
    document.documentElement.lang = normalized;
    setLang(normalized);
  };

  return { lang, t, changeLanguage };
}
