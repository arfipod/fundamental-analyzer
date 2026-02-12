// @ts-nocheck
import {
  localizeDynamicText,
  renderMetricDetail,
  renderPrintableMetricDetail
} from './scoringLocalization';

function gradeLabel(g, t) {
  return (
    {
      excellent: t('excellent', 'Excellent'),
      good: t('good', 'Good'),
      average: t('average', 'Average'),
      poor: t('poor', 'Poor'),
      info: t('info', 'Info')
    }[g] || g
  );
}

function gradeBadgeClass(g) {
  return (
    {
      excellent: 'badge-green',
      good: 'badge-blue',
      average: 'badge-yellow',
      poor: 'badge-red',
      info: 'badge-purple'
    }[g] || 'badge-blue'
  );
}

function gradeEmoji(g) {
  return { excellent: '🟢', good: '🔵', average: '🟡', poor: '🔴' }[g] || '⚪';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildPrintableDashboardPanel(data, results, industrySelection = null, lang) {
  const sectionBlocks = (results.sections || [])
    .map((section) => {
      const sectionTitle = `${section.icon || '•'} ${localizeDynamicText(section.title || '', lang)}`;
      const metrics = (section.items || [])
        .map((item) => {
          const metricName = localizeDynamicText(item.name || 'Metric', lang);
          const signalText = localizeDynamicText(item.signalText || '', lang);
          const signal =
            item.signal === 'bull'
              ? lang === 'es'
                ? '🟢 Positiva'
                : '🟢 Positive'
              : item.signal === 'bear'
                ? lang === 'es'
                  ? '🔴 Negativa'
                  : '🔴 Negative'
                : lang === 'es'
                  ? '🟡 Neutral'
                  : '🟡 Neutral';
          const note = localizeDynamicText(item.note || '', lang);
          const { headline, bulletHtml } = renderPrintableMetricDetail(
            item,
            lang,
            escapeHtml
          );
          return `<li class="print-metric">
            <div class="print-title">${escapeHtml(metricName)}</div>
            ${headline ? `<div class="print-headline">${escapeHtml(headline)}</div>` : ''}
            <ul class="print-bullets">${bulletHtml}</ul>
            <div class="print-signal"><strong>${escapeHtml(lang === 'es' ? 'Señal:' : 'Signal:')}</strong> ${escapeHtml(signal)}${signalText ? ` · ${escapeHtml(signalText)}` : ''}</div>
            ${note ? `<div class="print-note">${escapeHtml(note)}</div>` : ''}
          </li>`;
        })
        .join('');
      return `<section><h3>${escapeHtml(sectionTitle)}</h3><ul class="print-metrics">${metrics}</ul></section>`;
    })
    .join('');

  const scoreLine = `${lang === 'es' ? 'Puntuación global' : 'Overall score'}: ${results.overallScore?.toFixed(1) || '-'} / 4.0`;
  const industryLine = industrySelection
    ? `${industrySelection.code} · ${industrySelection.name} (${industrySelection.profile})`
    : lang === 'es'
      ? 'Sin industria seleccionada'
      : 'No selected industry';

  return `<div class="printable-panel fade-up">
    <div class="printable-header">
      <h2>${escapeHtml(data.ticker ? `${data.ticker} — ${data.company}` : data.company)}</h2>
      <p>${escapeHtml(data.period || '')}</p>
      <p class="printable-help">${lang === 'es' ? 'Vista simplificada para imprimir. Puedes usar la impresión del navegador (Ctrl/Cmd+P).' : 'Simplified print-friendly view. Use your browser print dialog (Ctrl/Cmd+P).'}</p>
    </div>
    <div class="printable-summary">
      <h3>${lang === 'es' ? 'Resumen rápido' : 'Quick summary'}</h3>
      <p>${escapeHtml(scoreLine)}</p>
      <p>${escapeHtml(lang === 'es' ? 'Industria:' : 'Industry:')} ${escapeHtml(industryLine)}</p>
      <p>${escapeHtml(lang === 'es' ? `Métricas analizadas: ${results.totalMetrics}` : `Analyzed metrics: ${results.totalMetrics}`)}</p>
    </div>
    ${sectionBlocks}
  </div>`;
}

function renderTrendBars(values, labels = []) {
  const series = Array.isArray(values) ? values : [];
  const points = Math.max(series.length, labels.length);
  if (!points) return '';

  const numeric = series.filter((v) => v !== null && v !== undefined && !isNaN(v));
  const max = Math.max(...numeric.map((v) => Math.abs(v)), 1);
  return `<div class="trend-bar">${Array.from({ length: points }, (_, i) => {
      const v = series[i];
      if (v === null || v === undefined || isNaN(v))
        return '<div class="bar bar-missing"></div>';
      const h = Math.max(2, (Math.abs(v) / max) * 30);
      const cls = v > 0 ? 'bar-pos' : v < 0 ? 'bar-neg' : 'bar-zero';
      const year = labels[i] || `#${i + 1}`;
      const label = `${year}: ${v.toFixed(2)}`;
      return `<button type="button" class="bar ${cls}" style="height:${h}px" title="${label}" aria-label="${label}" data-point="${label}"></button>`;
    }).join('')}</div>`;
}

export function renderDashboardView(
  data,
  results,
  industrySelection,
  { lang, t, buildSummary, buildIndustryPanel, goBackAction = 'goBack()' }
) {
  const overallLabel = gradeLabel(results.overall || 'average', t);

  let html = `
    <div class="dash-header fade-up">
      <div>
        <h2>${data.ticker ? data.ticker + ' — ' : ''}${data.company}</h2>
        <span class="price">${data.price || ''} ${data.period ? '• ' + localizeDynamicText(data.period, lang) : ''} • ${results.totalMetrics} ${t('metricsAnalyzed', 'metrics analyzed')}</span>
      </div>
      <div class="header-actions">
        <button class="btn-toggle-sections" onclick="switchDashboardTab('print')">${lang === 'es' ? '🖨️ Imprimir' : '🖨️ Print'}</button>
        <button id="toggleSectionsBtn" class="btn-toggle-sections" onclick="toggleAllSections()">${t('collapseAll', 'Collapse all sections')}</button>
        <button class="btn-back" onclick="${goBackAction}">${t('newAnalysis', '← New Analysis')}</button>
      </div>
    </div>

    <div class="dashboard-tabs fade-up delay-1">
      <button class="dashboard-tab active" data-tab="analysis" onclick="switchDashboardTab('analysis')">${lang === 'es' ? 'Análisis' : 'Analysis'}</button>
      <button class="dashboard-tab" data-tab="industry" onclick="switchDashboardTab('industry')">${lang === 'es' ? 'KPIs por industria' : 'Industry KPIs'}</button>
      <button class="dashboard-tab" data-tab="print" onclick="switchDashboardTab('print')">${lang === 'es' ? '🖨️ Imprimible' : '🖨️ Printable'}</button>
    </div>

    <div class="dashboard-panel" data-panel="analysis">`;

  const byId = (id) => results.sections.find((s) => s.id === id);
  const catDefs = [
    { k: 'Quality', sec: ['harmony', 'cashflow-truth', 'margins', 'cashflow'], href: '#harmony' },
    { k: 'Moat', sec: ['moat', 'margins'], href: '#moat' },
    { k: 'Financial Risk', sec: ['balance', 'balance-composition', 'debt'], href: '#balance' },
    { k: 'Valuation', sec: ['valuation', 'valuation-philosophy'], href: '#valuation-philosophy' }
  ];
  html += `<div class="score-row">`;
  catDefs.forEach((cat) => {
    const found = cat.sec.map(byId).filter(Boolean);
    const signals = found.flatMap((f) => f.items || []);
    const bears = signals.filter((i) => i.signal === 'bear').length;
    const bulls = signals.filter((i) => i.signal === 'bull').length;
    const grade = bears >= 2 ? 'poor' : bulls > bears ? 'good' : 'average';
    const driver = localizeDynamicText(signals[0]?.name || 'Not enough data', lang);
    const light = grade === 'poor' ? '🔴' : grade === 'good' ? '🟢' : '🟡';
    html += `<div class="score-card ${grade} fade-up"><div class="label">${localizeDynamicText(`2-minute ${cat.k}`, lang)}</div><div class="value">${light} ${gradeLabel(grade, t)}</div><div class="detail">${driver} · <a href="${cat.href}" style="color:var(--accent)">${localizeDynamicText('see details', lang)}</a></div></div>`;
  });
  html += `</div>`;

  const cards = [
    {
      label: localizeDynamicText('Overall Health', lang),
      value: overallLabel,
      grade: results.overall,
      detail: `${lang === 'es' ? 'Puntuación' : 'Score'}: ${results.overallScore?.toFixed(1)}/4.0`
    },
    ...Object.entries(results.scores).map(([k, g]) => ({
      label: localizeDynamicText(k.charAt(0).toUpperCase() + k.slice(1), lang),
      value: gradeEmoji(g) + ' ' + gradeLabel(g, t),
      grade: g,
      detail: ''
    }))
  ];

  html += `<div class="score-row">`;
  cards.forEach((c, i) => {
    html += `<div class="score-card ${c.grade} fade-up delay-${Math.min(i + 1, 6)}">
      <div class="label">${c.label}</div>
      <div class="value">${c.value}</div>
      ${c.detail ? `<div class="detail">${c.detail}</div>` : ''}
    </div>`;
  });
  html += `</div>`;

  results.sections.forEach((sec, si) => {
    const badgeCls = gradeBadgeClass(sec.grade);
    html += `
    <div id="${sec.id || `sec-${si}`}" class="section fade-up delay-${Math.min(si + 2, 6)}">
      <div class="section-head${si < 4 ? ' open' : ''}" onclick="toggleSection(this)">
        <span style="font-size:1.2rem">${sec.icon}</span>
        <h3>${localizeDynamicText(sec.title, lang)}</h3>
        <span class="metric-count">${sec.items.length} ${t('metricsAnalyzed', 'metrics analyzed')}</span>
        <span class="badge ${badgeCls}">${gradeLabel(sec.grade, t)}</span>
        <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="section-body">
        <div class="analysis-grid">
    `;
    sec.items.forEach((item) => {
      const sigCls =
        item.signal === 'bull'
          ? 'signal-bull'
          : item.signal === 'bear'
            ? 'signal-bear'
            : item.signal === 'info'
              ? 'signal-info'
              : 'signal-neutral';
      const dotCls =
        item.signal === 'bull'
          ? 'dot-green'
          : item.signal === 'bear'
            ? 'dot-red'
            : item.signal === 'info'
              ? 'dot-blue'
              : 'dot-yellow';
      html += `
        <div class="a-item">
          <div>
            <div class="metric-name">${localizeDynamicText(item.name, lang)}${item.tip ? ` <span class="tip" data-tip="${localizeDynamicText(item.tip, lang)}">ⓘ</span>` : ''} <span class="tip" data-tip="${t('scoreConditions', 'Score conditions')}: ${localizeDynamicText(item.scoreRule || item.explanation || item.signalText || '', lang)}">🏷️</span></div>
            ${renderMetricDetail(item.detail || '', lang)}
            ${item.explanation ? `<div class="metric-values">${localizeDynamicText(item.explanation, lang)}</div>` : ''}
            <div class="metric-values">${t('confidence', 'Confidence')}: ${(item.confidence * 100).toFixed(0)}%</div>
            ${renderTrendBars(item.values?.fullValues || item.values, item.values?.fullLabels || item.labels || [])}
          </div>
          <div class="signal ${sigCls}">
            <span class="dot ${dotCls}"></span>
            ${localizeDynamicText(item.signalText, lang)}
          </div>
        </div>
      `;
    });
    html += `</div></div></div>`;
  });

  html += buildSummary(data, results);
  html += `</div><div class="dashboard-panel" data-panel="industry" style="display:none">${buildIndustryPanel(data, results, industrySelection)}</div><div class="dashboard-panel" data-panel="print" style="display:none">${buildPrintableDashboardPanel(data, results, industrySelection, lang)}</div>`;
  return html;
}
