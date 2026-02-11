import { useEffect, useState } from 'react';
import { GICS_INDUSTRIES } from '../../domain/industry/data';
import {
  switchDashboardTab,
  toggleAllSections,
  toggleSection,
  updateToggleSectionsButton
} from '../../domain/metrics/scoring';
import { useAnalyzer } from '../hooks/useAnalyzer';
import { useI18n } from '../hooks/useI18n';

export function AnalyzerPage() {
  const { lang, t, changeLanguage } = useI18n();
  const { analyze, dashboardHtml, hasDashboard, error, clear } = useAnalyzer();
  const [raw, setRaw] = useState('');
  const [profile, setProfile] = useState('auto');
  const [industry, setIndustry] = useState('');
  const [includeAnalystNoise, setIncludeAnalystNoise] = useState(false);
  const [customProfileInput, setCustomProfileInput] = useState('');

  useEffect(() => {
    const sorted = [...GICS_INDUSTRIES].sort((a, b) => a.code.localeCompare(b.code));
    setIndustry(sorted[0]?.code ?? '');
  }, []);

  useEffect(() => {
    window.toggleSection = toggleSection;
    window.toggleAllSections = toggleAllSections;
    window.switchDashboardTab = switchDashboardTab;
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
            <textarea id="dataInput" placeholder={t('dataPlaceholder')} value={raw} onChange={(e) => setRaw(e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', alignItems: 'center', margin: '.6rem 0' }}>
              <label htmlFor="langSelect" className="mono" style={{ fontSize: '.8rem', color: 'var(--text-dim)' }}>{t('language')}</label>
              <select id="langSelect" className="profile-select" value={lang} onChange={(e) => changeLanguage(e.target.value)}>
                <option value="es">Español 🇪🇸</option>
                <option value="en">English 🇬🇧</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <select id="profileSelect" className="profile-select" value={profile} onChange={(e) => setProfile(e.target.value)}>
                <option value="auto">{t('profile.auto')}</option>
                <option value="default">{t('profile.default')}</option>
                <option value="saas">{t('profile.saas')}</option>
                <option value="retail">{t('profile.retail')}</option>
                <option value="industrial">{t('profile.industrial')}</option>
                <option value="financial">{t('profile.financial')}</option>
                <option value="utility">{t('profile.utility')}</option>
                <option value="custom">{t('profile.custom')}</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: '.55rem' }}>
              <label htmlFor="industrySelect" className="mono" style={{ fontSize: '.8rem', color: 'var(--text-dim)' }}>{t('industry')}</label>
              <select id="industrySelect" className="profile-select" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                {[...GICS_INDUSTRIES]
                  .sort((a, b) => a.code.localeCompare(b.code))
                  .map((item) => (
                    <option key={item.code} value={item.code}>{`${item.code} · ${item.name}`}</option>
                  ))}
              </select>
            </div>
            {profile === 'custom' ? (
              <div id="customProfileWrap" style={{ marginTop: '.6rem' }}>
                <textarea
                  id="customProfileInput"
                  style={{ width: '100%', minHeight: '120px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.76rem', padding: '.7rem' }}
                  value={customProfileInput}
                  placeholder={t('customJsonPlaceholder')}
                  onChange={(e) => setCustomProfileInput(e.target.value)}
                />
                <div style={{ fontSize: '.75rem', color: 'var(--text-dim)', marginTop: '.2rem' }}>{t('customProfileHint')}</div>
              </div>
            ) : null}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '.5rem' }}>
              <label style={{ fontSize: '.8rem', color: 'var(--text-dim)', display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                <input type="checkbox" checked={includeAnalystNoise} onChange={(e) => setIncludeAnalystNoise(e.target.checked)} /> <span>{t('includeAnalystNoise')}</span>
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="btn-analyze" onClick={() => analyze(raw, profile, includeAnalystNoise, customProfileInput, industry, lang)}>
                {t('analyze')}
              </button>
            </div>
            {error ? <div id="error-msg" style={{ display: 'block' }}>{error}</div> : <div id="error-msg" />}
          </div>
        </div>
      ) : (
        <div id="dashboard" style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: dashboardHtml }} />
      )}
    </>
  );
}

declare global {
  interface Window {
    toggleSection: typeof toggleSection;
    toggleAllSections: typeof toggleAllSections;
    switchDashboardTab: typeof switchDashboardTab;
    goBack: () => void;
  }
}
