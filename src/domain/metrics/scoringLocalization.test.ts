import { describe, expect, it } from 'vitest';

import {
  canonicalizeFinancialLabel,
  localizeDynamicText,
  normalizeLabelText,
  renderMetricDetail,
  renderPrintableMetricDetail,
  translateFinancialLabel
} from './scoringLocalization';

describe('scoringLocalization', () => {
  it('normalizes labels with whitespace and typo fixes', () => {
    expect(normalizeLabelText('  inmobilizado\u00A0  bruto ')).toBe('inmovilizado bruto');
    expect(normalizeLabelText('beneficio  netos')).toBe('beneficio neto');
    expect(normalizeLabelText('margen % )')).toBe('margen %)');
  });

  it('canonicalizes english, spanish and synonym labels', () => {
    expect(canonicalizeFinancialLabel('Gross Profit')).toMatchObject({
      canonicalEn: 'Gross Profit',
      es: 'Beneficio bruto',
      match: 'exact_en'
    });

    expect(canonicalizeFinancialLabel('Beneficio bruto')).toMatchObject({
      canonicalEn: 'Gross Profit',
      match: 'exact_es'
    });

    expect(canonicalizeFinancialLabel('capital expenditures')).toMatchObject({
      canonicalEn: 'Capital Expenditure',
      match: 'synonym'
    });
  });

  it('translates financial labels based on target language', () => {
    expect(translateFinancialLabel('Gross Profit', 'es')).toBe('Beneficio bruto');
    expect(translateFinancialLabel('Beneficio bruto', 'en')).toBe('Gross Profit');
  });

  it('localizes known metric/fragment tokens but keeps larger words intact', () => {
    const translated = localizeDynamicText(
      'Operating Leverage is up while supplier remains supported',
      'es'
    );

    expect(translated).toContain('Apalancamiento operativo');
    expect(translated).toContain('al alza');
    expect(translated).toContain('supplier');
    expect(translated).toContain('supported');
    expect(translated).not.toContain('al alzapplier');
  });

  it('renders structured metric detail into details/summary/list blocks', () => {
    const html = renderMetricDetail(
      'Revenue YoY Growth • Interpretation: stable execution • Trend: up',
      'es'
    );

    expect(html).toContain('<details class="metric-detail">');
    expect(html).toContain('<span class="md-kpi">Crecimiento interanual de ingresos</span>');
    expect(html).toContain('<span class="md-interpret">estable execution</span>');
    expect(html).toContain('<span class="md-label">Tendencia:</span> al alza');
  });

  it('renders simple metric detail without details wrapper when not structured', () => {
    const html = renderMetricDetail('Operating Leverage', 'es');
    expect(html).toBe('<div class="metric-detail">Apalancamiento operativo</div>');
  });

  it('renders printable detail with escaped labels/values and explanation', () => {
    const { headline, bulletHtml } = renderPrintableMetricDetail(
      {
        detail:
          'Revenue YoY Growth • Interpretation: <script>alert(1)</script> • Trend: up',
        explanation: 'Gross Profit: 42%'
      },
      'en',
      (value: string) =>
        value
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
    );

    expect(headline).toContain('Revenue YoY Growth');
    expect(bulletHtml).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(bulletHtml).toContain('<strong>Trend:</strong> up');
    expect(bulletHtml).toContain('<strong>Data:</strong> Gross Profit: 42%');
  });

  it('returns default printable bullet when metric has no detail or explanation', () => {
    const { bulletHtml } = renderPrintableMetricDetail(
      { detail: '', explanation: '' },
      'es',
      (value: string) => value
    );

    expect(bulletHtml).toContain('Sin detalle adicional.');
  });
});
