import { I18N } from './en';

export type SupportedLang = 'es' | 'en';
export type TranslationKey = keyof typeof I18N.en;
