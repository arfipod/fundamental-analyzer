import { useMemo, useState } from 'react';
import { parseInput } from '../../application/parse';
import { runAnalysis } from '../../application/analyze';
import { buildScorecard } from '../../application/buildScorecard';
import { GICS_INDUSTRIES } from '../../domain/industry/data';
import { renderDashboard } from '../../domain/metrics/scoring';

export function useAnalyzer() {
  const [dashboardHtml, setDashboardHtml] = useState('');
  const [error, setError] = useState('');

  const analyze = (raw: string, profile: string, includeAnalystNoise: boolean, customProfileInput: string, industryCode: string, lang: 'es'|'en') => {
    setError('');
    if (!raw || raw.length < 100) {
      setError(lang === 'es' ? 'Pega todos los datos financieros de TIKR (parecen demasiado cortos).' : 'Please paste the full TIKR financial data (it seems too short).');
      return;
    }

    try {
      const data = parseInput(raw);
      const secCount = Object.keys(data.sections || {}).length;
      const rowCount = Object.values(data.sections || {}).reduce((s: number, sec: any) => s + (sec?.rows?.length || 0), 0);
      if (secCount === 0 || rowCount === 0) {
        setError(lang === 'es' ? 'No se detectaron tablas TIKR. Asegúrate de pegar tablas markdown (líneas que empiezan por "|"), incluyendo cabecera con fechas.' : 'No TIKR tables detected. Make sure you pasted the markdown tables (lines starting with "|") including the header row with dates.');
        return;
      }

      const options: { customThresholds?: unknown; includeAnalystNoise: boolean } = { includeAnalystNoise };
      let engineProfile = profile;
      if (profile === 'custom') {
        try {
          options.customThresholds = JSON.parse(customProfileInput);
          engineProfile = 'default';
        } catch {
          setError(lang === 'es' ? 'El JSON del perfil personalizado es inválido. Corrígelo e inténtalo de nuevo.' : 'Custom profile JSON is invalid. Fix the JSON and try again.');
          return;
        }
      }

      const results = runAnalysis(data, engineProfile, options);
      const industrySelection = GICS_INDUSTRIES.find((item) => item.code === industryCode) ?? null;
      const html = renderDashboard(data, results, industrySelection);
      setDashboardHtml(buildScorecard(html).dashboardHtml);
    } catch (err) {
      console.error(err);
      setError(lang === 'es' ? 'Falló el parseo/análisis. Abre la consola DevTools para ver más detalles.' : 'Parsing/analyzing failed. Open DevTools console for details.');
    }
  };

  const clear = () => setDashboardHtml('');

  return useMemo(() => ({ analyze, dashboardHtml, hasDashboard: Boolean(dashboardHtml), error, clear }), [dashboardHtml, error]);
}
