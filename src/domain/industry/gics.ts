import type { IndustryProfileId } from './profiles';

export interface GicsIndustry {
  code: string;
  name: string;
  profileId: IndustryProfileId;
}

export const GICS_INDUSTRIES: GicsIndustry[] = [
  { code: '451020', name: 'Software', profileId: 'software' },
  { code: '451010', name: 'IT Services', profileId: 'software' },
  { code: '401010', name: 'Banks', profileId: 'banks' },
  { code: '201060', name: 'Machinery', profileId: 'industrials' },
  { code: '201020', name: 'Building Products', profileId: 'industrials' },
  { code: '101020', name: 'Oil, Gas & Consumable Fuels', profileId: 'default' }
];
