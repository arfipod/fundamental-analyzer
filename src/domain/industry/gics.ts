import type { IndustryProfileId } from './profiles';

export interface GicsIndustry {
  code: string;
  name: string;
  profileId: IndustryProfileId;
  legacyProfile: string;
}

const LEGACY_TO_PROFILE: Record<string, IndustryProfileId> = {
  'IT – Software': 'software',
  'IT – IT Services': 'software',
  'Financials – Banks': 'banks',
  'Industrials – Capital Goods': 'industrials',
  'Industrials – Construction & Building': 'industrials',
  'Industrials – Services & Distributors': 'industrials'
};

const rawGics: Array<[string, string, string]> = [
  ['101010', 'Energy Equipment & Services', 'Energy – Oilfield Services'],
  ['101020', 'Oil, Gas & Consumable Fuels', 'Energy – Upstream & Fuels'],
  ['151010', 'Chemicals', 'Materials – Chemicals'],
  ['151020', 'Construction Materials', 'Materials – Materials ex-metals'],
  ['151030', 'Containers & Packaging', 'Materials – Materials ex-metals'],
  ['151040', 'Metals & Mining', 'Materials – Metals & Mining'],
  ['151050', 'Paper & Forest Products', 'Materials – Materials ex-metals'],
  ['201010', 'Aerospace & Defense', 'Industrials – Capital Goods'],
  ['201020', 'Building Products', 'Industrials – Construction & Building'],
  ['201030', 'Construction & Engineering', 'Industrials – Construction & Building'],
  ['201040', 'Electrical Equipment', 'Industrials – Capital Goods'],
  ['201050', 'Industrial Conglomerates', 'Industrials – Capital Goods'],
  ['201060', 'Machinery', 'Industrials – Capital Goods'],
  ['201070', 'Trading Companies & Distributors', 'Industrials – Services & Distributors'],
  ['202010', 'Commercial Services & Supplies', 'Industrials – Services & Distributors'],
  ['202020', 'Professional Services', 'Industrials – Services & Distributors'],
  ['203010', 'Air Freight & Logistics', 'Transportation'],
  ['203020', 'Passenger Airlines', 'Transportation'],
  ['203030', 'Marine Transportation', 'Transportation'],
  ['203040', 'Ground Transportation', 'Transportation'],
  ['203050', 'Transportation Infrastructure', 'Transportation'],
  ['251010', 'Automobile Components', 'ConsDisc – Autos & Suppliers'],
  ['251020', 'Automobiles', 'ConsDisc – Autos & Suppliers'],
  ['252010', 'Household Durables', 'ConsDisc – Brands/Leisure/Services'],
  ['252020', 'Leisure Products', 'ConsDisc – Brands/Leisure/Services'],
  ['252030', 'Textiles, Apparel & Luxury Goods', 'ConsDisc – Brands/Leisure/Services'],
  ['253010', 'Hotels, Restaurants & Leisure', 'ConsDisc – Brands/Leisure/Services'],
  ['253020', 'Diversified Consumer Services', 'ConsDisc – Brands/Leisure/Services'],
  ['255010', 'Distributors', 'ConsDisc – Brands/Leisure/Services'],
  ['255030', 'Broadline Retail', 'ConsDisc – Retail'],
  ['255040', 'Specialty Retail', 'ConsDisc – Retail'],
  ['301010', 'Consumer Staples Distribution & Retail', 'ConsStap – Retail'],
  ['302010', 'Beverages', 'ConsStap – Brands'],
  ['302020', 'Food Products', 'ConsStap – Brands'],
  ['302030', 'Tobacco', 'ConsStap – Brands'],
  ['303010', 'Household Products', 'ConsStap – Brands'],
  ['303020', 'Personal Care Products', 'ConsStap – Brands'],
  ['351010', 'Health Care Equipment & Supplies', 'Health – MedTech'],
  ['351020', 'Health Care Providers & Services', 'Health – Providers & Tech'],
  ['351030', 'Health Care Technology', 'Health – Providers & Tech'],
  ['352010', 'Pharmaceuticals', 'Health – Pharma & Biotech'],
  ['352020', 'Biotechnology', 'Health – Pharma & Biotech'],
  ['352030', 'Life Sciences Tools & Services', 'Health – Life Sci Tools'],
  ['401010', 'Banks', 'Financials – Banks'],
  ['402010', 'Financial Services', 'Financials – Lenders & MREITs'],
  ['402020', 'Consumer Finance', 'Financials – Lenders & MREITs'],
  ['402030', 'Capital Markets', 'Financials – Capital Markets'],
  ['402040', 'Mortgage Real Estate Investment Trusts', 'Financials – Lenders & MREITs'],
  ['403010', 'Insurance', 'Financials – Insurance'],
  ['451010', 'IT Services', 'IT – IT Services'],
  ['451020', 'Software', 'IT – Software'],
  ['452010', 'Communications Equipment', 'IT – Hardware & Components'],
  ['452020', 'Technology Hardware, Storage & Peripherals', 'IT – Hardware & Components'],
  ['452030', 'Electronic Equipment, Instruments & Components', 'IT – Hardware & Components'],
  ['453010', 'Semiconductors & Semiconductor Equipment', 'IT – Semiconductors'],
  ['501010', 'Diversified Telecommunication Services', 'Comms – Telecom'],
  ['501020', 'Wireless Telecommunication Services', 'Comms – Telecom'],
  ['502010', 'Media', 'Comms – Media & Entertainment'],
  ['502020', 'Entertainment', 'Comms – Media & Entertainment'],
  ['502030', 'Interactive Media & Services', 'Comms – Interactive Platforms'],
  ['551010', 'Electric Utilities', 'Utilities – Regulated'],
  ['551020', 'Gas Utilities', 'Utilities – Regulated'],
  ['551030', 'Multi-Utilities', 'Utilities – Regulated'],
  ['551040', 'Water Utilities', 'Utilities – Regulated'],
  ['551050', 'Independent Power and Renewable Electricity Producers', 'Utilities – IPPs & Renewables'],
  ['601010', 'Diversified REITs', 'Real Estate – Equity REITs'],
  ['601020', 'Industrial REITs', 'Real Estate – Equity REITs'],
  ['601025', 'Hotel & Resort REITs', 'Real Estate – Equity REITs'],
  ['601030', 'Office REITs', 'Real Estate – Equity REITs'],
  ['601040', 'Health Care REITs', 'Real Estate – Equity REITs'],
  ['601050', 'Residential REITs', 'Real Estate – Equity REITs'],
  ['601060', 'Retail REITs', 'Real Estate – Equity REITs'],
  ['601070', 'Specialized REITs', 'Real Estate – Equity REITs'],
  ['602010', 'Real Estate Management & Development', 'Real Estate – Dev/Management']
];

export const GICS_INDUSTRIES: GicsIndustry[] = rawGics.map(
  ([code, name, legacyProfile]): GicsIndustry => ({
    code,
    name,
    legacyProfile,
    profileId: LEGACY_TO_PROFILE[legacyProfile] ?? 'default'
  })
);
