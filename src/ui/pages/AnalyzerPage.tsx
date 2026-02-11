import { useEffect, useMemo, useState } from 'react';
import { GICS_INDUSTRIES } from '../../domain/industry/data';
import {
  switchDashboardTab,
  toggleAllSections,
  toggleSection,
  updateToggleSectionsButton,
  openPrintView
} from '../../domain/metrics/scoring';
import { useAnalyzer } from '../hooks/useAnalyzer';
import { useI18n } from '../hooks/useI18n';
import appleTestData from '../../../test-data/apple.md?raw';

export function AnalyzerPage() {
  const { lang, t, changeLanguage } = useI18n();
  const { analyze, dashboardHtml, hasDashboard, error, clear } = useAnalyzer();
  const [raw, setRaw] = useState('');
  const sortedIndustries = useMemo(
    () => [...GICS_INDUSTRIES].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const [industry, setIndustry] = useState('');
  const [industryQuery, setIndustryQuery] = useState('');
  const [includeAnalystNoise, setIncludeAnalystNoise] = useState(false);

  const filteredIndustries = useMemo(() => {
    const query = industryQuery.trim().toLowerCase();
    if (!query) return sortedIndustries;

    return sortedIndustries.filter((item) => {
      const haystack = `${item.name} ${item.code}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [industryQuery, sortedIndustries]);

  useEffect(() => {
    if (industry && filteredIndustries.length > 0) {
      const selectedStillVisible = filteredIndustries.some(
        (item) => item.code === industry
      );
      if (!selectedStillVisible) {
        setIndustry(filteredIndustries[0].code);
      }
    }
  }, [filteredIndustries, industry]);

  useEffect(() => {
    window.toggleSection = toggleSection;
    window.toggleAllSections = toggleAllSections;
    window.switchDashboardTab = switchDashboardTab;
    window.openPrintView = openPrintView;
    window.goBack = clear;
    updateToggleSectionsButton();
  }, [dashboardHtml, clear]);

  return (
    <>
      {!hasDashboard ? (
        <div id="landing">
          <h1>{t('appTitle', 'Fundamental Analyzer')}</h1>
          <p className="subtitle">{t('subtitle')}</p>
          <div className="input-wrap">
            <textarea
              id="dataInput"
              placeholder={t('dataPlaceholder')}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '.5rem',
                alignItems: 'center',
                margin: '.6rem 0'
              }}
            >
              <label
                htmlFor="langSelect"
                className="mono"
                style={{ fontSize: '.8rem', color: 'var(--text-dim)' }}
              >
                {t('language')}
              </label>
              <select
                id="langSelect"
                className="profile-select"
                value={lang}
                onChange={(e) => changeLanguage(e.target.value)}
              >
                <option value="es">Español 🇪🇸</option>
                <option value="en">English 🇬🇧</option>
              </select>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '.55rem'
              }}
            >
              <label
                htmlFor="industrySearch"
                className="mono"
                style={{ fontSize: '.8rem', color: 'var(--text-dim)' }}
              >
                {t('industry')}
              </label>
              <input
                id="industrySearch"
                className="profile-select"
                style={{ width: 'min(100%, 420px)' }}
                value={industryQuery}
                onChange={(e) => setIndustryQuery(e.target.value)}
                placeholder={
                  lang === 'es'
                    ? 'Buscar industria por nombre o código…'
                    : 'Search industry by name or code…'
                }
              />
              <select
                id="industrySelect"
                className="profile-select"
                style={{ width: 'min(100%, 420px)' }}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">
                  {lang === 'es' ? '-- Ninguna --' : '-- None --'}
                </option>
                {filteredIndustries.map((item) => (
                  <option
                    key={item.code}
                    value={item.code}
                  >{`${item.name} (${item.code})`}</option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '.5rem'
              }}
            >
              <label
                style={{
                  fontSize: '.8rem',
                  color: 'var(--text-dim)',
                  display: 'flex',
                  gap: '.4rem',
                  alignItems: 'center'
                }}
              >
                <input
                  type="checkbox"
                  checked={includeAnalystNoise}
                  onChange={(e) => setIncludeAnalystNoise(e.target.checked)}
                />{' '}
                <span>{t('includeAnalystNoise')}</span>
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="landing-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setRaw(appleTestData)}
                >
                  {t('loadDemoData')}
                </button>
                <button
                  className="btn-analyze"
                  onClick={() =>
                    analyze(raw, includeAnalystNoise, industry, lang)
                  }
                >
                  {t('analyze')}
                </button>
              </div>
            </div>
            {error ? (
              <div id="error-msg" style={{ display: 'block' }}>
                {error}
              </div>
            ) : (
              <div id="error-msg" />
            )}
          </div>
        </div>
      ) : (
        <div
          id="dashboard"
          style={{ display: 'block' }}
          dangerouslySetInnerHTML={{ __html: dashboardHtml }}
        />
      )}
      <footer className="app-footer">Made with 💙 by arrf</footer>
    </>
  );
}

declare global {
  interface Window {
    toggleSection: typeof toggleSection;
    toggleAllSections: typeof toggleAllSections;
    switchDashboardTab: typeof switchDashboardTab;
    openPrintView: typeof openPrintView;
    goBack: () => void;
  }
}
