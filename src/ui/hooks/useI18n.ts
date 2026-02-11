import { useMemo, useState } from 'react';
import { LANGUAGE_KEY } from '../../infrastructure/storage/localStorage';
import { translate } from '../../domain/i18n/translator';
import { setLanguage } from '../../domain/metrics/scoring';

export function useI18n() {
  const [lang, setLang] = useState<'es' | 'en'>(
    localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'es'
  );

  const t = useMemo(() => (key: string, fallback = '') => translate(lang, key, fallback), [lang]);

  const changeLanguage = (value: string) => {
    const normalized = value === 'en' ? 'en' : 'es';
    setLang(normalized);
    setLanguage(normalized);
  };

  return { lang, t, changeLanguage };
}
