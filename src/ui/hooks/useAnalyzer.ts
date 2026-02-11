import { useMemo, useState } from 'react';
import { parseInput } from '../../application/parse';
import { runAnalysis } from '../../application/analyze';
import { buildScorecard } from '../../application/buildScorecard';
import { GICS_INDUSTRIES } from '../../domain/industry/data';
import { renderDashboard } from '../../domain/metrics/scoring';

type ParsedSection = { rows?: unknown[] };
type ParsedData = { sections?: Record<string, ParsedSection> };
type RenderDashboardFn = (
  data: unknown,
  results: unknown,
  industrySelection?: unknown
) => string;

const renderDashboardTyped = renderDashboard as unknown as RenderDashboardFn;

export function useAnalyzer() {
  const [dashboardHtml, setDashboardHtml] = useState('');
  const [error, setError] = useState('');

  const analyze = (
    raw: string,
    includeAnalystNoise: boolean,
    industryCode: string,
    lang: 'es' | 'en'
  ) => {
    setError('');
    if (!raw || raw.length < 100) {
      setError(
        lang === 'es'
          ? 'Pega todos los datos financieros de TIKR (parecen demasiado cortos).'
          : 'Please paste the full TIKR financial data (it seems too short).'
      );
      return;
    }

    try {
      const data = parseInput(raw) as ParsedData;
      const secCount = Object.keys(data.sections || {}).length;
      const rowCount = Object.values(data.sections || {}).reduce(
        (s: number, sec: ParsedSection) => s + (sec?.rows?.length || 0),
        0
      );
      if (secCount === 0 || rowCount === 0) {
        setError(
          lang === 'es'
            ? 'No se detectaron tablas TIKR. Asegúrate de pegar tablas markdown (líneas que empiezan por "|"), incluyendo cabecera con fechas.'
            : 'No TIKR tables detected. Make sure you pasted the markdown tables (lines starting with "|") including the header row with dates.'
        );
        return;
      }

      const options = { includeAnalystNoise };
      const industrySelection =
        GICS_INDUSTRIES.find((item) => item.code === industryCode) ?? null;
      const engineProfile = industrySelection?.profile ?? 'default';

      const results = runAnalysis(data, engineProfile, options);
      const html = renderDashboardTyped(
        data,
        results,
        industrySelection ?? undefined
      );
      setDashboardHtml(buildScorecard(html).dashboardHtml);
    } catch (err) {
      console.error(err);
      setError(
        lang === 'es'
          ? 'Falló el parseo/análisis. Abre la consola DevTools para ver más detalles.'
          : 'Parsing/analyzing failed. Open DevTools console for details.'
      );
    }
  };

  const clear = () => setDashboardHtml('');

  return useMemo(
    () => ({
      analyze,
      dashboardHtml,
      hasDashboard: Boolean(dashboardHtml),
      error,
      clear
    }),
    [dashboardHtml, error]
  );
}
