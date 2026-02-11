import { analyze } from '../domain/metrics/scoring';

export function runAnalysis(
  data: unknown,
  profile: string,
  options: { customThresholds?: unknown; includeAnalystNoise?: boolean } = {}
) {
  return analyze(data, profile, options);
}
