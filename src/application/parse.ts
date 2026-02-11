import { parseTIKR } from '../domain/metrics/scoring';

export function parseInput(raw: string) {
  return parseTIKR(raw);
}
