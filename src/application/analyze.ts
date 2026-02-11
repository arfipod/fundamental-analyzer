import { analyze } from '../domain/metrics/scoring';

export function runAnalysis(data: unknown, profile: string, options: { customThresholds?: unknown }) {
  return analyze(data, profile, options);
}
