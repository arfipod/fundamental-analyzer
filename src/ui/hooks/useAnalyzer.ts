import { useMemo, useState } from 'react';
import { analyze as analyzeUseCase } from '../../application/analyze';
import { parseInput } from '../../application/parse';
import type { DashboardVM } from '../../application/viewmodels/dashboardVM';
import { GICS_INDUSTRIES } from '../../domain/industry/gics';

export function useAnalyzer() {
  const [dashboardVm, setDashboardVm] = useState<DashboardVM | null>(null);
  const [error, setError] = useState('');

  const analyze = (
    raw: string,
    _includeAnalystNoise: boolean,
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
      const parsed = parseInput(raw);
      if (parsed.sections.length === 0) {
        setError(
          lang === 'es'
            ? 'No se detectaron tablas TIKR. Incluye tablas markdown que empiecen por "|".'
            : 'No TIKR tables detected. Include markdown tables that start with "|".'
        );
        return;
      }

      const selectedCode =
        GICS_INDUSTRIES.find((industry) => industry.code === industryCode)?.code ??
        GICS_INDUSTRIES[0].code;
      setDashboardVm(analyzeUseCase(parsed, { industryCode: selectedCode }));
    } catch (err) {
      console.error(err);
      setError(
        lang === 'es'
          ? 'Falló el parseo/análisis. Revisa el formato del markdown.'
          : 'Parsing/analyzing failed. Review the markdown format.'
      );
    }
  };

  const clear = () => setDashboardVm(null);

  return useMemo(
    () => ({
      analyze,
      dashboardVm,
      hasDashboard: Boolean(dashboardVm),
      error,
      clear
    }),
    [dashboardVm, error]
  );
}
