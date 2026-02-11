import { useMemo, useState } from 'react';
import { GICS_INDUSTRIES } from '../../domain/industry/gics';
import { useAnalyzer } from '../hooks/useAnalyzer';
import { useI18n } from '../hooks/useI18n';

const gradeClass: Record<string, string> = { A: 'excellent', B: 'good', C: 'average', D: 'poor' };

export function AnalyzerPage() {
  const { lang, t, changeLanguage } = useI18n();
  const { analyze, dashboardVm, hasDashboard, error, clear } = useAnalyzer();
  const [raw, setRaw] = useState('');
  const [industryQuery, setIndustryQuery] = useState('');
  const [includeAnalystNoise, setIncludeAnalystNoise] = useState(false);
  const [tab, setTab] = useState<'analysis' | 'industry'>('analysis');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const sortedIndustries = useMemo(
    () => [...GICS_INDUSTRIES].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const [industryCode, setIndustryCode] = useState(sortedIndustries[0]?.code ?? '451020');

  const filteredIndustries = useMemo(() => {
    const query = industryQuery.trim().toLowerCase();
    if (!query) return sortedIndustries;
    return sortedIndustries.filter((industry) => `${industry.name} ${industry.code}`.toLowerCase().includes(query));
  }, [industryQuery, sortedIndustries]);

  const allOpen = dashboardVm
    ? dashboardVm.sections.every((section) => openSections[section.id] !== false)
    : false;

  const toggleAll = () => {
    if (!dashboardVm) return;
    const next = Object.fromEntries(dashboardVm.sections.map((section) => [section.id, !allOpen]));
    setOpenSections(next);
  };

  if (!hasDashboard || !dashboardVm) {
    return (
      <div id="landing">
        <h1>{t('appTitle')}</h1>
        <p className="subtitle">{t('subtitle')}</p>
        <div className="input-wrap">
          <textarea id="dataInput" placeholder={t('dataPlaceholder')} value={raw} onChange={(e) => setRaw(e.target.value)} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', margin: '.6rem 0' }}>
            <label htmlFor="langSelect" className="mono" style={{ fontSize: '.8rem', color: 'var(--text-dim)' }}>{t('language')}</label>
            <select id="langSelect" className="profile-select" value={lang} onChange={(e) => changeLanguage(e.target.value)}>
              <option value="es">Español 🇪🇸</option><option value="en">English 🇬🇧</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label htmlFor="industrySearch" className="mono" style={{ fontSize: '.8rem', color: 'var(--text-dim)' }}>{t('industry')}</label>
            <input id="industrySearch" className="profile-select" style={{ width: 'min(100%, 420px)' }} value={industryQuery} onChange={(e) => setIndustryQuery(e.target.value)} placeholder={t('searchIndustryPlaceholder')} />
            <select id="industrySelect" className="profile-select" style={{ width: 'min(100%, 420px)' }} value={industryCode} onChange={(e) => setIndustryCode(e.target.value)}>
              {filteredIndustries.map((item) => <option key={item.code} value={item.code}>{`${item.name} (${item.code})`}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '.5rem' }}>
            <label style={{ fontSize: '.8rem', color: 'var(--text-dim)', display: 'flex', gap: '.4rem' }}>
              <input type="checkbox" checked={includeAnalystNoise} onChange={(e) => setIncludeAnalystNoise(e.target.checked)} />
              <span>{t('includeAnalystNoise')}</span>
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-analyze" onClick={() => analyze(raw, includeAnalystNoise, industryCode, lang)}>{t('analyze')}</button>
          </div>
          {error ? <div id="error-msg" style={{ display: 'block' }}>{error}</div> : <div id="error-msg" />}
        </div>
      </div>
    );
  }

  return (
    <div id="dashboard" style={{ display: 'block' }}>
      <header className="dash-header">
        <div>
          <h2>{t('dashboardTitle')}</h2>
          <div className="price">{dashboardVm.metadata.ticker} · {dashboardVm.metadata.company}</div>
          <small>{t('appliedProfile')}: {dashboardVm.metadata.appliedProfile}</small>
        </div>
        <div className="header-actions">
          <button className="btn-toggle-sections" onClick={toggleAll}>{allOpen ? t('collapseAll') : t('openAll')}</button>
          <button className="btn-back" onClick={clear}>{t('newAnalysis')}</button>
        </div>
      </header>

      <div className="tabs" style={{ display: 'flex', gap: '.6rem', marginBottom: '1rem' }}>
        <button className="btn-toggle-sections" aria-pressed={tab === 'analysis'} onClick={() => setTab('analysis')}>{t('analysisTab')}</button>
        <button className="btn-toggle-sections" aria-pressed={tab === 'industry'} onClick={() => setTab('industry')}>{t('industryTab')}</button>
      </div>

      {tab === 'analysis' ? (
        <>
          <section className="score-row" aria-label={t('scorecardsTitle')}>
            {dashboardVm.cards.map((card) => (
              <article key={card.id} className={`score-card ${gradeClass[card.grade]}`}>
                <div className="label">{card.title}</div>
                <strong>{card.grade}</strong>
                <p>{card.summary}</p>
              </article>
            ))}
          </section>

          <section>
            {dashboardVm.sections.map((section) => {
              const isOpen = openSections[section.id] !== false;
              return (
                <article key={section.id} className="section" style={{ marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)' }}>
                  <button
                    className="section-head open"
                    style={{ width: '100%', textAlign: 'left', background: 'transparent', color: 'var(--text)', padding: '.9rem 1rem', border: 'none', cursor: 'pointer' }}
                    aria-expanded={isOpen}
                    onClick={() => setOpenSections((prev) => ({ ...prev, [section.id]: !isOpen }))}
                  >
                    {section.title}
                  </button>
                  {isOpen ? (
                    <div style={{ padding: '0 1rem 1rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          {section.rows.slice(0, 12).map((row) => (
                            <tr key={row.label}>
                              <td style={{ padding: '.35rem 0', color: 'var(--text-dim)' }}>{row.label}</td>
                              <td style={{ padding: '.35rem 0', textAlign: 'right' }}>{row.values.at(-1) ?? '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </section>
        </>
      ) : (
        <section className="score-card" aria-label={t('industryContextTitle')}>
          <h3>{dashboardVm.industryPanel.industryName} ({dashboardVm.industryPanel.industryCode})</h3>
          <p><strong>Valuation:</strong> {dashboardVm.industryPanel.valuation}</p>
          <p><strong>KPIs:</strong> {dashboardVm.industryPanel.kpis}</p>
          <p><strong>Focus metrics:</strong> {dashboardVm.industryPanel.highlightMetrics.join(', ')}</p>
        </section>
      )}
    </div>
  );
}
