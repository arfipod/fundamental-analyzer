// @ts-nocheck
let currentLang = localStorage.getItem('fundamentalAnalyzerLang') || 'es';
const langListeners = new Set();

export function getCurrentLang() {
  return currentLang;
}
export function setCurrentLang(lang) {
  setLanguage(lang);
}

export function t(key, fallback = '') {
  return (
    window.I18N?.[currentLang]?.[key] ||
    window.I18N?.en?.[key] ||
    fallback ||
    key
  );
}

function applyLocalization() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!el.dataset.i18nDefault) el.dataset.i18nDefault = el.textContent || '';
    el.textContent = t(key, el.dataset.i18nDefault);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!el.dataset.i18nPlaceholderDefault)
      el.dataset.i18nPlaceholderDefault = el.placeholder || '';
    el.placeholder = t(key, el.dataset.i18nPlaceholderDefault);
  });
}

function emitLangChange() {
  for (const cb of langListeners) cb(currentLang);
}

export function onLanguageChange(cb) {
  if (typeof cb !== 'function') return () => {};
  langListeners.add(cb);
  return () => langListeners.delete(cb);
}

export function setLanguage(lang) {
  currentLang = lang === 'en' ? 'en' : 'es';
  localStorage.setItem('fundamentalAnalyzerLang', currentLang);
  applyLocalization();
  const langSel = document.getElementById('langSelect');
  if (langSel) langSel.value = currentLang;
  emitLangChange();
}

const FINANCIAL_LABEL_EN_ES = {
  Revenues: 'Ingresos',
  'Total Revenues': 'Ingresos totales',
  '% Change YoY': '% De cambio interanual',
  'Cost of Goods Sold': 'Coste de los bienes vendidos',
  'Gross Profit': 'Beneficio bruto',
  '% Gross Margins': '% Márgenes brutos',
  'Selling General & Admin Expenses':
    'Gastos de venta generales y administrativos',
  'Depreciation & Amortization': 'Depreciación y amortización',
  'Amortization of Goodwill and Intangible Assets':
    'Amortización de fondos de comercio y activos intangibles',
  'Other Operating Expenses': 'Otros gastos operacionales',
  'Total Operating Expenses': 'Gastos operativos totales',
  'Operating Income': 'Beneficio operativo',
  '% Operating Margins': '% Márgenes operativos',
  'Interest Expense': 'Gastos por intereses',
  'Interest And Investment Income': 'Ingresos por intereses e inversiones',
  'Currency Exchange Gains (Loss)': 'Ganancias (pérdidas) cambiarias',
  'Other Non Operating Income (Expenses)':
    'Otros ingresos (gastos) no operativos',
  'EBT Excl. Unusual Items': 'EBT excl. Artículos inusuales',
  'Merger & Restructuring Charges': 'Cargos de fusión y reestructuración',
  'Impairment of Goodwill': 'Deterioro del fondo de comercio',
  'Gain (Loss) On Sale Of Investments':
    'Ganancia (pérdida) por venta de inversiones',
  'Legal Settlements': 'Acuerdos legales',
  'Other Unusual Items': 'Otros artículos inusuales',
  'EBT Incl. Unusual Items': 'EBT incl. Artículos extraordinarios',
  'Income Tax Expense': 'Gastos de impuestos',
  'Earnings From Continuing Operations':
    'Beneficios por operaciones continuadas',
  'Net Income to Company': 'Beneficio neto de la empresa',
  'Net Income': 'Beneficio neto',
  'Preferred Dividend and Other Adjustments':
    'Dividendo preferente y otros ajustes',
  'Net Income to Common Incl Extra Items':
    'Beneficio neto a acciones comunes incluidos extraordinarios',
  '% Net Income to Common Incl Extra Items Margins':
    'Margen de beneficio neto a acciones comunes incluidos extraordinarios %',
  'Net Income to Common Excl. Extra Items':
    'Beneficio neto a acciones comunes excluidos extraordinarios',
  '% Net Income to Common Excl. Extra Items Margins':
    'Margen de beneficio neto a acciones comunes excluidos extraordinarios %',
  'Supplementary Data:': 'Datos adicionales:',
  'Diluted EPS Excl Extra Items': 'BPA diluido sin extraordinarios',
  'Weighted Average Diluted Shares Outstanding':
    'Promedio ponderado de acciones diluidas en circulación',
  'Weighted Average Basic Shares Outstanding':
    'Promedio ponderado de acciones básicas en circulación',
  'Basic EPS': 'BPA básico',
  EBITDA: 'EBITDA',
  EBITDAR: 'EBITDAR',
  'Selling and Marketing Expense': 'Gastos de venta y marketing',
  'Effective Tax Rate %': 'Tasa efectiva de impuestos %',
  'Market Cap': 'Capitalización de mercado',
  'Price Close': 'Precio de cierre',
  TEV: 'TEV',
  'Cash And Equivalents': 'Efectivo y equivalentes',
  'Total Cash And Short Term Investments':
    'Efectivo total e inversiones a corto plazo',
  'Accounts Receivable': 'Cuentas por cobrar',
  'Other Receivables': 'Otros por cobrar',
  'Notes Receivable': 'Notas por cobrar',
  'Total Receivables': 'Total de cuentas por cobrar',
  'Prepaid Expenses': 'Gastos pagados por anticipado',
  'Restricted Cash': 'Efectivo restringido',
  'Other Current Assets': 'Otro activo corriente',
  'Total Current Assets': 'Total de activo corriente',
  'Gross Property Plant And Equipment': 'Inmovilizado material bruto',
  'Accumulated Depreciation': 'Depreciación acumulada',
  'Net Property Plant And Equipment': 'Inmovilizado material neto',
  Goodwill: 'Fondo de comercio',
  'Other Intangibles': 'Otros intangibles',
  'Deferred Tax Assets Long-Term':
    'Activos por impuestos diferidos a largo plazo',
  'Deferred Charges Long-Term': 'Cargos diferidos a largo plazo',
  'Other Long-Term Assets': 'Otros activos a largo plazo',
  'Total Assets': 'Activo total',
  'Accounts Payable': 'Cuentas por pagar',
  'Accrued Expenses': 'Gastos devengados',
  'Short-term Borrowings': 'Préstamos de corto plazo',
  'Current Portion of Long-Term Debt':
    'Porción corriente de la deuda a largo plazo',
  'Current Portion of Capital Lease Obligations':
    'Porción corriente de las obligaciones de arrendamiento financiero',
  'Unearned Revenue Current': 'Ingresos no devengados (corriente)',
  'Other Current Liabilities': 'Otros pasivos corrientes',
  'Total Current Liabilities': 'Total pasivo corriente',
  'Long-Term Debt': 'Deuda a largo plazo',
  'Capital Leases': 'Arrendamientos de capitales',
  'Deferred Tax Liability Non Current':
    'Pasivo por impuesto diferido no corriente',
  'Other Non Current Liabilities': 'Otro pasivo no corrientes',
  'Total Liabilities': 'Pasivo Total',
  'Common Stock': 'Acciones comunes',
  'Additional Paid In Capital': 'Prima de suscripción',
  'Retained Earnings': 'Beneficio no distribuido',
  'Treasury Stock': 'Autocartera',
  'Comprehensive Income and Other': 'Resultado integral y otros',
  'Total Common Equity': 'Patrimonio neto común total',
  'Total Equity': 'Fondos propios totales',
  'Total Liabilities And Equity': 'Pasivo total y patrimonio neto',
  'Total Shares Out. on Filing Date':
    'Total de acciones fuera. en la fecha de presentación',
  'Book Value / Share': 'Valor contable / Acción',
  'Tangible Book Value': 'Valor contable tangible',
  'Tangible Book Value / Share': 'Valor contable tangible / acción',
  'Total Debt': 'Deuda total',
  'Net Debt': 'Deuda neta',
  Land: 'Terrenos',
  Buildings: 'Edificios',
  'Construction In Progress': 'Construcción en progreso',
  'Full Time Employees': 'Empleados a tiempo completo',
  'Cash Flow Statement': 'Estado de flujo de efectivo',
  'Total Depreciation & Amortization': 'Depreciación y amortización total',
  'Amortization of Deferred Charges': 'Amortización de cargos diferidos',
  '(Gain) Loss on Sale of Investments':
    '(Ganancia) Pérdida por venta de inversiones',
  'Asset Writedown & Restructuring Costs':
    'Deterioro de activos y costes de reestructuración',
  'Stock-Based Compensation': 'Compensación de stock options',
  'Other Operating Activities': 'Otras actividades operativas',
  'Change In Accounts Receivable': 'Cambio en cuentas por cobrar',
  'Change In Accounts Payable': 'Cambio en cuentas por pagar',
  'Change in Unearned Revenues': 'Cambio en los ingresos no devengados',
  'Change in Other Net Operating Assets':
    'Variación en otros activos operativos netos',
  'Cash from Operations': 'Efectivo de Operaciones',
  'Memo: Change in Net Working Capital':
    'Nota: Cambio en el capital circulante',
  'Capital Expenditure': 'Gastos de capital',
  'Cash Acquisitions': 'Adquisiciones con efectivo',
  'Sale (Purchase) of Intangible assets':
    'Venta (compra) de activos intangibles',
  'Other Investing Activities': 'Otras actividades de inversión',
  'Cash from Investing': 'Efectivo de la inversión',
  'Total Debt Issued': 'Deuda total emitida',
  'Total Debt Repaid': 'Total de la deuda reembolsada',
  'Issuance of Common Stock': 'Emisión de acciones ordinarias',
  'Repurchase of Common Stock': 'Recompra de acciones comunes',
  'Other Financing Activities': 'Otras Actividades de Financiamiento',
  'Cash from Financing': 'Efectivo de Financiamiento',
  'Foreign Exchange Rate Adjustments': 'Ajustes del tipo de cambio de divisas',
  'Net Change in Cash': 'Cambio neto en efectivo',
  'Free Cash Flow': 'Flujo de caja libre',
  '% Free Cash Flow Margins': '% Márgenes de flujo de caja libre',
  'Cash and Cash Equivalents, Beginning of Period':
    'Efectivo y equivalentes de efectivo, comienzo del período',
  'Cash and Cash Equivalents, End of Period':
    'Efectivo y equivalentes de efectivo, fin de período',
  'Cash Interest Paid': 'Intereses en efectivo pagados',
  'Cash Taxes Paid': 'Impuestos en efectivo pagados',
  'Cash Flow per Share': 'Flujo de caja por acción'
};

const FINANCIAL_SYNONYMS = {
  sga: 'Selling General & Admin Expenses',
  'sg&a': 'Selling General & Admin Expenses',
  'selling general & admin': 'Selling General & Admin Expenses',
  'selling general and admin': 'Selling General & Admin Expenses',
  'selling, general & administrative': 'Selling General & Admin Expenses',
  'selling general & administrative': 'Selling General & Admin Expenses',
  'cash and cash equivalents': 'Cash And Equivalents',
  'capital expenditures': 'Capital Expenditure',
  'capital expenditure': 'Capital Expenditure',
  'unearned revenue current': 'Unearned Revenue Current'
};

const LABEL_NORMALIZATION_FIXES = {
  inmobilizado: 'inmovilizado',
  'beneficio netos': 'beneficio neto',
  extradordinarios: 'extraordinarios'
};

function normalizeLabelText(label) {
  if (!label) return '';
  let out = String(label)
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*%\s*/g, ' % ')
    .trim();
  Object.entries(LABEL_NORMALIZATION_FIXES).forEach(([wrong, ok]) => {
    const re = new RegExp(wrong, 'gi');
    out = out.replace(re, ok);
  });
  return out.replace(/%\s+\)/g, '%)').replace(/\s+/g, ' ').trim();
}

const FINANCIAL_LABEL_NORMALIZED_EN = Object.fromEntries(
  Object.entries(FINANCIAL_LABEL_EN_ES).map(([en, es]) => [
    normalizeLabelText(en).toLowerCase(),
    { en, es }
  ])
);

const FINANCIAL_LABEL_NORMALIZED_ES = Object.fromEntries(
  Object.entries(FINANCIAL_LABEL_EN_ES).map(([en, es]) => [
    normalizeLabelText(es).toLowerCase(),
    { en, es }
  ])
);

function canonicalizeFinancialLabel(label) {
  const raw = String(label || '');
  const normalized = normalizeLabelText(raw);
  const key = normalized.toLowerCase();
  const exactEn = FINANCIAL_LABEL_NORMALIZED_EN[key];
  if (exactEn)
    return {
      raw,
      normalized,
      canonicalEn: exactEn.en,
      es: exactEn.es,
      match: 'exact_en'
    };

  const exactEs = FINANCIAL_LABEL_NORMALIZED_ES[key];
  if (exactEs)
    return {
      raw,
      normalized,
      canonicalEn: exactEs.en,
      es: exactEs.es,
      match: 'exact_es'
    };

  const syn = FINANCIAL_SYNONYMS[normalized.toLowerCase()];
  if (syn && FINANCIAL_LABEL_EN_ES[syn]) {
    return {
      raw,
      normalized,
      canonicalEn: syn,
      es: FINANCIAL_LABEL_EN_ES[syn],
      match: 'synonym'
    };
  }

  return { raw, normalized, canonicalEn: raw, es: raw, match: 'fallback' };
}

function translateFinancialLabel(label) {
  const c = canonicalizeFinancialLabel(label);
  return currentLang === 'es' ? c.es || c.raw : c.canonicalEn || c.raw;
}

const DYNAMIC_I18N = {
  sectionTitles: {
    Growth: 'Crecimiento',
    'Profitability & Margins': 'Rentabilidad y Márgenes',
    'Cost Structure & OpEx': 'Estructura de Costes y OpEx',
    'Returns & Economic Moat': 'Retornos y Foso Económico',
    'Balance Sheet Composition': 'Composición del Balance',
    'Debt & Financial Health': 'Deuda y Salud Financiera',
    'Cash Flow Quality': 'Calidad del Flujo de Caja',
    'Efficiency & Operations': 'Eficiencia y Operaciones',
    Valuation: 'Valoración',
    'Dividends & Shareholder Returns': 'Dividendos y Retorno al Accionista',
    'Consensus Estimates': 'Estimaciones de Consenso',
    'Analyst Sentiment (Low weight / noisy — ruido)':
      'Sentimiento de Analistas (bajo peso / ruidoso)',
    'Harmony & Red Flags': 'Armonía y Banderas Rojas',
    'Balance Sheet Reality Check': 'Chequeo de Realidad del Balance',
    'Cash Flow — The Truth Serum': 'Flujo de Caja — Suero de la Verdad'
  },
  metricNames: {
    'Current Ratio': 'Ratio Corriente',
    'Quick Ratio': 'Ratio Rápido',
    'Revenue Growth (CAGR)': 'Crecimiento de Ingresos (CAGR)',
    'Revenue YoY Growth': 'Crecimiento interanual de ingresos',
    'EPS Growth (Diluted)': 'Crecimiento del BPA (diluido)',
    'EBITDA Growth': 'Crecimiento del EBITDA',
    'Operating Income Growth': 'Crecimiento del beneficio operativo',
    'Net Income Growth': 'Crecimiento del beneficio neto',
    'Free Cash Flow Growth': 'Crecimiento del flujo de caja libre',
    'Gross Margin': 'Margen bruto',
    'Operating Margin (EBIT)': 'Margen operativo (EBIT)',
    'EBITDA Margin': 'Margen EBITDA',
    'FCF Margin': 'Margen de FCF',
    'Margin Expansion vs Gross': 'Expansión de márgenes vs bruto',
    'Operating Leverage': 'Apalancamiento operativo',
    'COGS as % of Revenue': 'COGS como % de ingresos',
    'Operating Expenses as % of Gross Profit':
      'Gastos operativos como % del beneficio bruto',
    'SG&A as % of Revenue': 'SG&A como % de ingresos',
    'R&D as % of Revenue': 'I+D como % de ingresos',
    'Effective Tax Rate': 'Tasa efectiva de impuestos',
    'Interest Expense as % of Revenue':
      'Gastos por intereses como % de ingresos',
    'Stock-Based Comp as % of Revenue':
      'Compensación en acciones como % de ingresos',
    'ROIC (Return on Invested Capital)':
      'ROIC (Retorno sobre Capital Invertido)',
    'ROE (Return on Equity)': 'ROE (Retorno sobre Patrimonio)',
    'ROA (Return on Assets)': 'ROA (Retorno sobre Activos)',
    'Equity Multiplier (ROE/ROA)': 'Multiplicador de patrimonio (ROE/ROA)',
    'Asset Turnover': 'Rotación de activos',
    'Receivables Turnover': 'Rotación de cuentas por cobrar',
    'Inventory Turnover': 'Rotación de inventarios',
    'Cash Conversion Cycle': 'Ciclo de conversión de caja',
    'Days Sales Outstanding (DSO)': 'Días de ventas pendientes (DSO)',
    'Enterprise Value vs Market Cap':
      'Enterprise Value vs Capitalización de mercado',
    'Forward P/E (NTM)': 'P/E futuro (NTM)',
    'Price / Sales': 'Precio / Ventas',
    'Price / Book Value': 'Precio / Valor contable',
    'EV/EBITDA (NTM)': 'EV/EBITDA (NTM)',
    'EV/EBIT': 'EV/EBIT',
    'FCF Yield (NTM)': 'Rentabilidad FCF (NTM)',
    'Dividend Yield': 'Rentabilidad por dividendo',
    'P/E Context Map (informational)': 'Mapa de contexto P/E (informativo)',
    'Dividends Per Share': 'Dividendos por acción',
    'Payout Ratio': 'Payout ratio',
    'Total Dividends Paid': 'Dividendos totales pagados',
    'Share Buybacks': 'Recompras de acciones',
    'Share Issuance (Dilution)': 'Emisión de acciones (dilución)',
    'Diluted Shares Outstanding': 'Acciones diluidas en circulación',
    'Total Shareholder Yield': 'Retorno total al accionista',
    'Consensus Revenue Estimate': 'Estimación de ingresos de consenso',
    'Consensus EPS Estimate': 'Estimación de BPA de consenso',
    'Consensus EBITDA Estimate': 'Estimación de EBITDA de consenso',
    'Consensus FCF Estimate': 'Estimación de FCF de consenso',
    'Revenue vs Earnings Harmony': 'Armonía ingresos vs beneficios',
    'CFO vs Net Income (Accrual Risk)':
      'CFO vs Beneficio neto (riesgo de devengo)',
    'FCF Consistency Check': 'Chequeo de consistencia del FCF',
    'Net Debt / Net Cash': 'Deuda neta / Caja neta',
    'Cash / Short-Term Debt': 'Caja / Deuda a corto plazo',
    'Receivables Days Trend': 'Tendencia de días de cobro',
    'Inventory vs Revenue Growth': 'Crecimiento inventario vs ingresos',
    'Goodwill + Intangibles Concentration':
      'Concentración de fondo de comercio + intangibles',
    'Deferred Revenue Signal': 'Señal de ingresos diferidos',
    'FCF Uses Summary': 'Resumen de usos del FCF',
    'SBC as % of FCF': 'SBC como % del FCF',
    'SBC as % of Net Income': 'SBC como % del beneficio neto'
  },
  fragments: {
    Latest: 'Último',
    Avg: 'Promedio',
    Trend: 'Tendencia',
    'Insufficient data': 'Datos insuficientes',
    Strong: 'Fuerte',
    Moderate: 'Moderado',
    Slow: 'Lento',
    Declining: 'En descenso',
    'Very Liquid': 'Muy líquido',
    Healthy: 'Saludable',
    OK: 'Correcto',
    'Low Liquidity ⚠️': 'Liquidez baja ⚠️',
    'Excludes inventory — more conservative than current ratio':
      'Excluye inventario: más conservador que el ratio corriente',
    'Very Healthy': 'Muy saludable',
    Adequate: 'Adecuado',
    'Tight Liquidity ⚠️': 'Liquidez ajustada ⚠️',
    'Not enough data': 'Datos insuficientes',
    'see details': 'ver detalle',
    Quality: 'Calidad',
    Moat: 'Foso',
    'Financial Risk': 'Riesgo Financiero',
    'Overall Health': 'Salud General',
    Valuation: 'Valoración',
    Growth: 'Crecimiento',
    Margins: 'Márgenes',
    Costs: 'Costes',
    Balance: 'Balance',
    Debt: 'Deuda',
    Cashflow: 'Flujo de caja',
    Efficiency: 'Eficiencia',
    Shareholder: 'Accionista',
    Harmony: 'Armonía',
    Good: 'Bueno',
    Excellent: 'Excelente',
    Average: 'Medio',
    Poor: 'Débil',
    Volatile: 'Volátil',
    Decent: 'Decente',
    'Best-in-class': 'Líder de clase',
    Elite: 'Élite',
    'Cash Machine': 'Máquina de caja',
    'Some Leverage': 'Algo de apalancamiento',
    'Investing in Innovation': 'Invirtiendo en innovación',
    Outstanding: 'Sobresaliente',
    'Negative CCC (Uses supplier float!)':
      'CCC negativo (usa financiación de proveedores)',
    'Strong supplier float (supplier financing)':
      'Fuerte supplier float (financiación de proveedores)',
    'Low payables float': 'Float de proveedores bajo',
    'Context only': 'Solo contexto',
    'Never Cut — Reliable': 'Nunca recortado — fiable',
    'In line': 'En línea',
    Manageable: 'Manejable',
    Contained: 'Contenido',
    Acceptable: 'Aceptable',
    'Aligned Growth': 'Crecimiento alineado',
    'Cash-backed earnings': 'Beneficios respaldados por caja',
    Neutral: 'Neutral',
    Covered: 'Cubierto',
    Stable: 'Estable',
    Limited: 'Limitado',
    Fair: 'Razonable',
    Expensive: 'Caro',
    'Very Rich': 'Muy exigente',
    Rich: 'Exigente',
    'Token Dividend': 'Dividendo simbólico',
    'Very Safe': 'Muy seguro',
    'Growing Distributions': 'Distribuciones crecientes',
    'Active Buybacks': 'Recompras activas',
    'Heavy Dilution ⚠️': 'Fuerte dilución ⚠️',
    'Shrinking ✓': 'Reduciéndose ✓',
    'Excellent Capital Return': 'Excelente retorno de capital',
    annual: 'anual',
    '2-minute Quality': 'Calidad en 2 minutos',
    '2-minute Moat': 'Foso en 2 minutos',
    '2-minute Financial Risk': 'Riesgo financiero en 2 minutos',
    '2-minute Valuation': 'Valoración en 2 minutos',
    'Return on Equity': 'Retorno sobre el patrimonio',
    'Return on Assets': 'Retorno sobre activos',
    'Enterprise Value vs Capitalización de mercado':
      'Valor de empresa (EV) vs capitalización de mercado',
    'Enterprise Value vs Market Cap':
      'Valor de empresa (EV) vs capitalización de mercado',
    'Revenue vs Earnings Harmony': 'Armonía entre ingresos y beneficios',
    Revenue: 'ingresos',
    Earnings: 'beneficios',
    'Revenue YoY': 'Ingresos interanuales (YoY)',
    'Earnings YoY': 'Beneficios interanuales (YoY)',
    'Std dev': 'desviación estándar',
    'erratic growth': 'crecimiento errático',
    'Net Profit Margin': 'Margen de beneficio neto',
    Exceptional: 'Excepcional',
    Stability: 'Estabilidad',
    stable: 'estable',
    up: 'al alza',
    'Gross Δ': 'Δ (cambio) bruto',
    'Op Δ': 'Δ (cambio) operativo',
    'Watch for cost structure issues':
      'Vigila posibles problemas en la estructura de costes',
    'Operating Expenses as % of Beneficio bruto':
      'Gastos operativos como % del beneficio bruto',
    'Golden rule: OpEx should not eat most gross profit (gastos operativos controlados).':
      'Regla de oro: el OpEx no debería comerse la mayor parte del beneficio bruto (gastos operativos controlados).',
    Controlled: 'Controlado',
    'SG&A': 'Gastos de venta, generales y administrativos (SG&A)',
    'Lower is better — shows operational efficiency':
      'Cuanto más bajo, mejor — indica eficiencia operativa',
    Minimal: 'Mínimo',
    'Beware: high leverage can inflate ROE artificially':
      'Ojo: un apalancamiento alto puede inflar el ROE artificialmente',
    'Equity Multiplier': 'Multiplicador del patrimonio (apalancamiento)',
    'Leverage-driven ROE': 'ROE impulsado por apalancamiento',
    Leveraged: 'Apalancada / con alto apalancamiento',
    'Private equity stress threshold is typically 4-5x':
      'El umbral de estrés típico en private equity suele ser 4–5x',
    'Very Low Debt': 'Deuda muy baja',
    'Very Low Deuda': 'Deuda muy baja',
    'Very Efficient': 'Muy eficiente',
    'Excellent Collection': 'Excelente gestión de cobros',
    'Negative CCC = the business generates cash before paying suppliers (very powerful)':
      'CCC negativo = el negocio genera efectivo antes de pagar a proveedores (muy potente)',
    'Buybacks reduce share count and boost EPS':
      'Las recompras reducen el número de acciones y elevan el BPA (EPS)',
    'Fewer shares = more value per share for existing holders':
      'Menos acciones = más valor por acción para los accionistas actuales',
    'Buybacks + dividends as % of market cap':
      'Recompras + dividendos como % de la capitalización bursátil',
    'Aligned Crecimiento': 'Crecimiento alineado',
    Aligned: 'Alineado',
    'Healthy conversion': 'Conversión saludable',
    Disciplined: 'Disciplinado',
    'Capital allocation context': 'Contexto de asignación de capital',
    'Classic heuristic: net margin >10% good, >20% excellent (sector-aware).':
      'Heurística clásica: margen neto >10% es bueno, >20% es excelente (dependiendo del sector).',
    'Classic heuristic: net margin >10 % good, >20 % excellent (sector-aware).':
      'Heurística clásica: margen neto >10% es bueno, >20% es excelente (dependiendo del sector).',
    'Gross vs Net Margin': 'Margen bruto vs margen neto',
    'Operating Discipline': 'Disciplina operativa',
    'If gross margin is stable but operating margin falls, overhead is eating profitability.':
      'Si el margen bruto se mantiene estable pero cae el margen operativo, los costes fijos/estructura se están comiendo la rentabilidad.',
    FCF: 'flujo de caja libre (FCF)',
    'Revenue trend: up | Earnings trend: stable | FCF trend: stable':
      'Tendencia de ingresos: al alza | tendencia de beneficios: estable | tendencia de FCF: estable',
    'FCF is the crown jewel: rising profits should eventually show up in free cash flow.':
      'El FCF es la joya de la corona: si los beneficios suben, debería terminar viéndose en el flujo de caja libre.',
    'Deuda neta / Net Cash': 'Deuda neta / caja neta',
    'Net Cash': 'caja neta',
    'Frequent large acquisitions increase integration risk':
      'Adquisiciones grandes y frecuentes aumentan el riesgo de integración',
    'Acquisition-heavy': 'Intensiva en adquisiciones',
    'debt paydown': 'amortización de deuda',
    'cash build': 'aumento/acumulación de caja',
    'FCF used for': 'FCF destinado a',
    '% of FCF': '% del FCF',
    buybacks: 'recompras',
    dividends: 'dividendos',
    EPS: 'BPA (beneficio por acción)',
    'NI/EPS': 'beneficio neto / BPA'
  }
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const FIN_LABEL_ENTRIES = Object.entries(FINANCIAL_LABEL_EN_ES).sort(
  (a, b) => b[0].length - a[0].length
);
const FIN_LABEL_ENTRIES_REVERSED = FIN_LABEL_ENTRIES.map(([en, es]) => [es, en]);
const METRIC_ENTRIES = Object.entries(DYNAMIC_I18N.metricNames).sort(
  (a, b) => b[0].length - a[0].length
);
const METRIC_ENTRIES_REVERSED = METRIC_ENTRIES.map(([en, es]) => [es, en]);
const SECTION_ENTRIES = Object.entries(DYNAMIC_I18N.sectionTitles).sort(
  (a, b) => b[0].length - a[0].length
);
const SECTION_ENTRIES_REVERSED = SECTION_ENTRIES.map(([en, es]) => [es, en]);
const FRAG_ENTRIES = Object.entries(DYNAMIC_I18N.fragments).sort(
  (a, b) => b[0].length - a[0].length
);
const FRAG_ENTRIES_REVERSED = FRAG_ENTRIES.map(([en, es]) => [es, en]);

function replaceBounded(text, from, to) {
  if (!from) return text;
  const escaped = escapeRegExp(from);
  const hasAlphaNum = /[A-Za-z0-9]/.test(from);
  if (!hasAlphaNum) return text.replaceAll(from, to);
  const re = new RegExp(`(^|[^A-Za-z0-9_])(${escaped})(?=$|[^A-Za-z0-9_])`, 'g');
  return text.replace(re, (_, lead) => `${lead}${to}`);
}

function localizeDynamicText(text) {
  if (!text) return text;
  let out = normalizeLabelText(String(text));

  const metricEntries =
    currentLang === 'es' ? METRIC_ENTRIES : METRIC_ENTRIES_REVERSED;
  metricEntries.forEach(([from, to]) => {
    out = replaceBounded(out, from, to);
  });

  const sectionEntries =
    currentLang === 'es' ? SECTION_ENTRIES : SECTION_ENTRIES_REVERSED;
  sectionEntries.forEach(([from, to]) => {
    out = replaceBounded(out, from, to);
  });

  const fragmentEntries =
    currentLang === 'es' ? FRAG_ENTRIES : FRAG_ENTRIES_REVERSED;
  fragmentEntries.forEach(([from, to]) => {
    out = replaceBounded(out, from, to);
  });

  const financialEntries =
    currentLang === 'es' ? FIN_LABEL_ENTRIES : FIN_LABEL_ENTRIES_REVERSED;
  financialEntries.forEach(([from, to]) => {
    out = replaceBounded(out, from, to);
  });

  return out;
}

// =========================================================
// PARSER — Converts TIKR markdown tables to structured data
// =========================================================
function parseNumber(s) {
  if (s === null || s === undefined) return null;
  if (typeof s === 'number') return Number.isFinite(s) ? s : null;
  if (typeof s !== 'string') return null;
  s = s.trim();
  if (s === '' || s === '-') return null;
  const isPct = s.includes('%');
  const multMatch = s.match(/([\d.,\s()\-+]+)\s*([BMK])\b/i);
  const suffix = multMatch ? multMatch[2].toUpperCase() : null;
  let neg = false;
  if (s.startsWith('(') && s.endsWith(')')) {
    neg = true;
    s = s.slice(1, -1);
  }
  s = s
    .replace(/[A-Z]{2,3}\$/gi, '')
    .replace(/US\$/gi, '')
    .replace(/[€£¥]/g, '')
    .replace(/\$/g, '')
    .replace(/%/g, '')
    .replace(/x$/i, '')
    .replace(/[BMK]$/i, '')
    .trim();
  if (s === '') return null;
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma > lastDot) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (lastDot > lastComma) {
    s = s.replace(/,/g, '');
  } else {
    s = s.replace(/,/g, '');
  }
  const val = parseFloat(s);
  if (isNaN(val)) return null;
  const multiplier =
    suffix === 'B' ? 1e9 : suffix === 'M' ? 1e6 : suffix === 'K' ? 1e3 : 1;
  const finalVal = val * multiplier;
  return neg ? -finalVal : finalVal;
}

function isLTM(label) {
  const normalized = String(label || '').toLowerCase().trim();
  return normalized.includes('ltm') || normalized === 'ttm';
}

function isNonPeriodLabel(label) {
  const normalized = String(label || '').toLowerCase().trim();
  return (
    normalized.includes('cagr') ||
    normalized.includes('crecmiento compuesto') ||
    normalized.includes('crecimiento compuesto') ||
    normalized.includes('compound growth')
  );
}

function toSeries(row, options = {}) {
  if (!row?.values?.length) return [];
  const excludeLTM = options.excludeLTM !== false;
  return row.values
    .map((v, i) => ({
      date: row.dates?.[i] ?? String(i),
      value: parseNumber(v)
    }))
    .filter(
      (p) =>
        p.value !== null &&
        (!excludeLTM || !isLTM(p.date)) &&
        !isNonPeriodLabel(p.date)
    );
}

function alignByDate(rowA, rowB, n = 6, options = {}) {
  const aSeries = toSeries(rowA, options);
  const bMap = new Map(
    toSeries(rowB, options).map((p) => [p.date, p.value])
  );
  return aSeries
    .map((p) => ({ date: p.date, a: p.value, b: bMap.get(p.date) ?? null }))
    .filter((p) => p.b !== null)
    .slice(-n);
}

function splitMarkdownRow(row) {
  // Protect escaped pipes (\\|) so we only split on real column separators.
  const sentinel = '\u241F';
  const protectedRow = row.replace(/\\\|/g, sentinel);

  const cells = protectedRow
    .split('|')
    .map((c) => c.replaceAll(sentinel, '|').trim());

  // remove leading/trailing empty cell due to leading/trailing pipe
  return cells.filter((c, i) => i > 0 && i < cells.length - 1);
}

function splitDelimitedRow(row, delimiter) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

function detectCsvDelimiter(line) {
  let commas = 0;
  let semicolons = 0;
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes && ch === ',') commas++;
    if (!inQuotes && ch === ';') semicolons++;
  }
  return semicolons > commas ? ';' : ',';
}

function looksLikeFinancialCsv(lines) {
  if (!lines.length) return false;
  const first = lines[0] || '';
  if (!first || first.startsWith('|')) return false;
  const delimiter = detectCsvDelimiter(first);
  const cols = splitDelimitedRow(first, delimiter).map((c) =>
    c.replace(/^"|"$/g, '').trim()
  );
  if (cols.length < 3) return false;
  const firstCol = cols[0].toLowerCase();
  if (
    !['date', 'datetime', 'fecha', 'periodo', 'period'].some((k) =>
      firstCol.includes(k)
    )
  )
    return false;
  return cols.slice(1).some((c) => c.length > 0);
}

const SECTION_HINTS = {
  'Income Statement': [
    'revenue',
    'ingresos',
    'cost of goods sold',
    'gross profit',
    'operating income',
    'ebit',
    'ebitda',
    'eps',
    'tax',
    'beneficio',
    'gastos',
    'marg',
    'dividend'
  ],
  'Balance Sheet': [
    'asset',
    'liabil',
    'equity',
    'debt',
    'cash and equivalents',
    'invent',
    'receivable',
    'payable',
    'activo',
    'pasivo',
    'patrimonio',
    'deuda',
    'efectivo'
  ],
  'Cash Flow': [
    'cash flow',
    'operating cash',
    'capital expenditure',
    'free cash flow',
    'stock based compensation',
    'depreciation',
    'flujo de caja',
    'capex',
    'depreciación'
  ],
  Ratios: [
    'ratio',
    '% change',
    'margin',
    'return on',
    'payout',
    'cagr',
    'margen',
    'cambio yoy',
    'yoy'
  ],
  'Valuation Multiples': [
    'market cap',
    'ev/',
    'p/e',
    'price close',
    'valuation',
    'capitalización',
    'precio'
  ],
  'Consensus Estimates': ['estimate', 'consensus', 'estimación', 'consenso']
};

function inferSectionFromHeaders(headers) {
  const scores = Object.fromEntries(
    Object.keys(SECTION_HINTS).map((section) => [section, 0])
  );
  headers.forEach((h) => {
    const normalized = normalizeLabelText(h).toLowerCase();
    Object.entries(SECTION_HINTS).forEach(([section, hints]) => {
      if (hints.some((hint) => normalized.includes(hint))) scores[section] += 1;
    });
  });
  let bestSection = 'Income Statement';
  let bestScore = -1;
  Object.entries(scores).forEach(([section, score]) => {
    if (score > bestScore) {
      bestSection = section;
      bestScore = score;
    }
  });
  return bestSection;
}

function parseCsvFinancialInput(lines, data) {
  const delimiter = detectCsvDelimiter(lines[0]);
  const header = splitDelimitedRow(lines[0], delimiter).map((c) =>
    c.replace(/^"|"$/g, '').trim()
  );
  if (header.length < 2) return false;

  const metricHeaders = header.slice(1);
  const dates = [];
  const matrix = [];

  for (const line of lines.slice(1)) {
    const cells = splitDelimitedRow(line, delimiter).map((c) =>
      c.replace(/^"|"$/g, '').trim()
    );
    if (cells.length < 2) continue;
    const rowDate = cells[0];
    if (!rowDate) continue;
    dates.push(rowDate);
    matrix.push(cells);
  }

  if (!dates.length) return false;

  const rows = metricHeaders.map((label, metricIdx) => {
    const rawLabel = normalizeLabelText(label);
    const cLabel = canonicalizeFinancialLabel(rawLabel);
    const values = matrix.map((row) => row[metricIdx + 1] || '');
    return {
      label: cLabel.canonicalEn,
      rawLabel,
      displayLabel: cLabel.es,
      labelNormalized: cLabel.normalized,
      values,
      dates
    };
  });

  const sectionName = inferSectionFromHeaders(metricHeaders);
  data.sections[sectionName] = { dates, rows };
  return true;
}

function detectSectionFromMarkdownHeader(rawLabel) {
  const normalized = normalizeLabelText(rawLabel).toLowerCase();
  if (
    normalized.includes('income statement') ||
    normalized.includes('cuenta de resultados')
  )
    return 'Income Statement';
  if (
    normalized.includes('balance sheet') ||
    normalized.includes('balance general') ||
    normalized.includes('estado de situación')
  )
    return 'Balance Sheet';
  if (
    normalized.includes('cash flow') ||
    normalized.includes('flujo de caja')
  )
    return 'Cash Flow';
  if (normalized.includes('ratios') || normalized.includes('ratio'))
    return 'Ratios';
  return null;
}

function parseMarkdownSectionRows(rows) {
  const parsed = [];
  let dates = [];
  for (const row of rows) {
    const cells = splitMarkdownRow(row);
    if (cells.length < 2) continue;
    if (cells[0] === '---' || cells.every((c) => c === '---' || c === ''))
      continue;
    const rawLabel = normalizeLabelText(cells[0]);
    if (
      (rawLabel.includes('TIKR') ||
        rawLabel.includes('Cuenta') ||
        rawLabel.includes('Balance') ||
        rawLabel.includes('Cash Flow') ||
        rawLabel.includes('Ratios') ||
        rawLabel.includes('Múltiplos') ||
        rawLabel.includes('Objetivos') ||
        rawLabel.includes('Estimaciones')) &&
      cells.some((c) => c.match(/\d{2}\/\d{2}\/\d{2}/))
    ) {
      dates = cells.slice(1).map((c) => c.replace('TIKR.com', '').trim());
      continue;
    }
    if (rawLabel === 'TIKR.com' || rawLabel === '---') continue;
    const cLabel = canonicalizeFinancialLabel(rawLabel);
    const values = cells.slice(1);
    parsed.push({
      label: cLabel.canonicalEn,
      rawLabel,
      displayLabel: cLabel.es,
      labelNormalized: cLabel.normalized,
      values,
      dates
    });
  }
  return { dates, rows: parsed };
}

export function parseTIKR(raw) {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l);
  const data = {
    ticker: '',
    company: '',
    price: null,
    priceNum: null,
    extractDate: '',
    period: '',
    sections: {}
  };
  const firstLineRaw = (lines[0] || '').replace(/^#+\s*/, '').trim();

  if (looksLikeFinancialCsv(lines)) {
    const csvData = parseCsvFinancialInput(lines, data);
    if (csvData) return data;
  }

  let ticker = '';
  let company = '';

  // Case A: "VEEV – Company Name"
  let m = firstLineRaw.match(/^([A-Z0-9.]+)\s*[–—-]\s*(.+)$/);

  // Case B: "– VEEV US$188.29 ..."
  if (!m) m = firstLineRaw.match(/^[–—-]\s*([A-Z0-9.]+)\b\s*(.*)$/);

  if (m) {
    ticker = (m[1] || '').trim();
    company = (m[2] || '').trim();
  } else {
    // last fallback: first "ticker-like" token
    const t = firstLineRaw.match(/\b[A-Z]{1,10}(?:\.[A-Z]{1,5})?\b/);
    if (t) ticker = t[0];
  }

  data.ticker = ticker;
  data.company = company || data.company || firstLineRaw;

  for (const l of lines) {
    const pm = l.match(/Price:\s*(US\$[\d.,]+)/);
    if (pm) {
      data.price = pm[1];
      data.priceNum = parseNumber(pm[1]);
    }
    const dm = l.match(/Extracted:\s*(.+)/);
    if (dm) data.extractDate = dm[1];
    const prm = l.match(/Period:\s*(\w+)/);
    if (prm) data.period = prm[1];
  }

  // Try to capture price from the headline if "Price:" line doesn't contain it
  if (!data.price) {
    const p = firstLineRaw.match(/US\$\s*[\d.,]+/);
    if (p) {
      data.price = p[0].replace(/\s+/g, ''); // "US$188.29"
      data.priceNum = parseNumber(p[0]);
    }
  }

  const sectionNames = [
    'Income Statement',
    'Balance Sheet',
    'Cash Flow',
    'Ratios',
    'Valuation Multiples',
    'Analyst Price Targets',
    'Consensus Estimates'
  ];
  let currentSection = null;
  let sectionLines = {};
  for (const l of lines) {
    const cleaned = l.replace(/^#+\s*/, '');
    const matchedSection = sectionNames.find(
      (n) => cleaned === n || cleaned.startsWith(n)
    );
    if (matchedSection) {
      currentSection = matchedSection;
      sectionLines[currentSection] = [];
      continue;
    }
    if (currentSection && l.startsWith('|')) {
      sectionLines[currentSection].push(l);
    }
  }

  for (const [secName, rows] of Object.entries(sectionLines)) {
    data.sections[secName] = parseMarkdownSectionRows(rows);
  }

  // Fallback: parse standalone markdown tables even without explicit section headings.
  if (!Object.keys(data.sections).length) {
    const markdownRows = lines.filter((l) => l.startsWith('|'));
    const blocks = [];
    let currentBlock = [];

    for (const row of markdownRows) {
      const cells = splitMarkdownRow(row);
      if (!cells.length) continue;

      const isTitleRow =
        detectSectionFromMarkdownHeader(cells[0]) &&
        cells.some((c) => c.match(/\d{2}\/\d{2}\/\d{2}/));

      if (isTitleRow && currentBlock.length) {
        blocks.push(currentBlock);
        currentBlock = [row];
        continue;
      }

      currentBlock.push(row);
    }

    if (currentBlock.length) blocks.push(currentBlock);

    for (const block of blocks) {
      const firstCells = splitMarkdownRow(block[0] || '');
      const sectionHint = detectSectionFromMarkdownHeader(firstCells[0] || '');
      if (!sectionHint) continue;
      data.sections[sectionHint] = parseMarkdownSectionRows(block);
    }
  }
  return data;
}

// =========================================================
// ANALYSIS ENGINE — COMPREHENSIVE HEURISTICS
// =========================================================
function getRecentValues(row, n = 5, options = {}) {
  if (!row) return [];
  const mapped = row.values.map((v, i) => {
    const label = row.dates?.[i] || '';
    const value = parseNumber(v);
    const skipNonPeriod = isNonPeriodLabel(label);
    return {
      value:
        options.excludeLTM !== false && isLTM(label)
          ? null
          : skipNonPeriod
            ? null
            : value,
      label
    };
  });
  const slicedAll = mapped.slice(-n);
  const slicedNumeric = slicedAll.filter((x) => x.value !== null);
  const vals = slicedNumeric.map((x) => x.value);
  vals.labels = slicedNumeric.map((x) => x.label);
  vals.fullValues = slicedAll.map((x) => x.value);
  vals.fullLabels = slicedAll.map((x) => x.label);
  return vals;
}

function extractPeriodYear(label) {
  const text = String(label || '').trim();
  if (!text) return null;

  const y4 = text.match(/(19|20)\d{2}/);
  if (y4) return Number(y4[0]);

  const y2 = text.match(/\b(\d{2})\b/);
  if (!y2) return null;
  const yr = Number(y2[1]);
  if (Number.isNaN(yr)) return null;
  return yr >= 80 ? 1900 + yr : 2000 + yr;
}

function getLatestCagrWindow(row, targetYears = 5, lookbackPoints = 12) {
  const series = toSeries(row).slice(-lookbackPoints);
  if (series.length < 2) return null;

  const latest = series[series.length - 1];
  const latestYear = extractPeriodYear(latest.date);
  let startIdx = null;
  let effectiveYears = null;

  if (latestYear !== null) {
    let bestPartial = null;
    for (let i = series.length - 2; i >= 0; i--) {
      const y = extractPeriodYear(series[i].date);
      if (y === null) continue;
      const diff = latestYear - y;
      if (diff === targetYears) {
        startIdx = i;
        effectiveYears = diff;
        break;
      }
      if (diff > 0 && diff < targetYears) {
        if (bestPartial === null || diff > bestPartial.diff) {
          bestPartial = { i, diff };
        }
      }
    }
    if (startIdx === null && bestPartial !== null) {
      startIdx = bestPartial.i;
      effectiveYears = bestPartial.diff;
    }
  }

  if (startIdx === null) {
    startIdx = Math.max(0, series.length - (targetYears + 1));
    effectiveYears = series.length - 1 - startIdx;
  }

  if (!effectiveYears || effectiveYears <= 0) return null;
  const start = series[startIdx];
  const gr = cagr(start.value, latest.value, effectiveYears);
  return {
    growth: gr,
    years: effectiveYears,
    startValue: start.value,
    endValue: latest.value
  };
}

function computeEquityMultiplierFromBalance(assetsRow, equityRow, n = 2) {
  const pairs = alignByDate(assetsRow, equityRow, 10)
    .filter((p) => p.a !== null && p.b !== null && p.b !== 0)
    .slice(-Math.max(1, n));

  if (!pairs.length) return null;
  const avgAssets = avg(pairs.map((p) => p.a));
  const avgEquity = avg(pairs.map((p) => p.b));
  if (avgAssets === null || avgEquity === null || avgEquity === 0) return null;
  return avgAssets / avgEquity;
}

function getLatest(row) {
  if (!row) return null;
  const vals = toSeries(row).map((p) => p.value);
  return vals.length > 0 ? vals[vals.length - 1] : null;
}

function getPrevious(row) {
  if (!row) return null;
  const vals = toSeries(row).map((p) => p.value);
  return vals.length > 1 ? vals[vals.length - 2] : null;
}

function getTrend(vals) {
  if (!vals || vals.length < 2) return 'neutral';
  let ups = 0,
    downs = 0;
  for (let i = 1; i < vals.length; i++) {
    if (vals[i] > vals[i - 1]) ups++;
    else if (vals[i] < vals[i - 1]) downs++;
  }
  if (ups > downs + 1) return 'up';
  if (downs > ups + 1) return 'down';
  return 'stable';
}

function cagr(first, last, years) {
  if (!first || !last || first <= 0 || last <= 0 || years <= 0) return null;
  return (Math.pow(last / first, 1 / years) - 1) * 100;
}

function avg(arr) {
  const valid = arr.filter((v) => v !== null && !isNaN(v));
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
}

function stddev(arr) {
  const valid = arr.filter((v) => v !== null && !isNaN(v));
  if (valid.length < 2) return null;
  const m = avg(valid);
  return Math.sqrt(
    valid.reduce((s, v) => s + (v - m) ** 2, 0) / (valid.length - 1)
  );
}

function yoyGrowth(vals) {
  if (!vals || vals.length < 2) return [];
  return vals.slice(1).map((v, i) => {
    const prev = vals[i];
    if (!prev || prev === 0) return null;
    return ((v - prev) / Math.abs(prev)) * 100;
  });
}

function median(arr) {
  const valid = arr
    .filter((v) => v !== null && !isNaN(v))
    .sort((a, b) => a - b);
  if (!valid.length) return null;
  return valid[Math.floor(valid.length / 2)];
}

function safeGrowthScore(vals) {
  const v = (vals || []).filter((x) => x !== null && !isNaN(x));
  if (v.length < 3) return { kind: 'na', value: null };
  const first = v[0];
  const latest = v[v.length - 1];
  const allPos = v.every((x) => x > 0);
  if (allPos) {
    return { kind: 'cagr', value: cagr(first, latest, v.length - 1) };
  }
  return { kind: 'median_yoy', value: median(yoyGrowth(v)) };
}

function getConfidence(vals) {
  const total = (vals || []).length;
  if (total === 0) return 0.25;
  const valid = vals.filter((v) => v !== null && !isNaN(v)).length;
  return Math.min(1, Math.max(0.25, valid / Math.max(3, total)));
}

const PROFILE_THRESHOLDS = {
  gross_margin: {
    default: { bull: 40, neutral: 25 },
    saas: { bull: 70, neutral: 55 },
    retail: { bull: 30, neutral: 18 },
    industrial: { bull: 35, neutral: 20 },
    financial: { bull: 35, neutral: 20 },
    utility: { bull: 35, neutral: 22 }
  },
  roic: {
    default: { bull: 20, neutral: 10 },
    saas: { bull: 18, neutral: 10 },
    retail: { bull: 14, neutral: 8 },
    industrial: { bull: 15, neutral: 8 },
    financial: { bull: 12, neutral: 6 },
    utility: { bull: 10, neutral: 6 }
  },
  ev_ebitda: {
    default: { bull: 12, neutral: 20 },
    saas: { bull: 20, neutral: 30 },
    retail: { bull: 10, neutral: 16 },
    industrial: { bull: 11, neutral: 17 },
    financial: { bull: 14, neutral: 22 },
    utility: { bull: 11, neutral: 16 }
  },
  opex_gp: {
    default: { bull: 60, neutral: 75 },
    saas: { bull: 62, neutral: 78 },
    retail: { bull: 55, neutral: 70 },
    industrial: { bull: 60, neutral: 75 },
    financial: { bull: 68, neutral: 80 },
    utility: { bull: 58, neutral: 72 }
  }
};

function metricThreshold(metric, profile, kind) {
  const node = PROFILE_THRESHOLDS[metric] || {};
  const scope = node[profile] || node.default || {};
  return scope[kind];
}

function inferProfile(snapshot = {}) {
  let score = {
    saas: 0,
    retail: 0,
    industrial: 0,
    utility: 0,
    financial: 0,
    default: 0
  };
  const sectorHint = String(snapshot.sectorHint || '').toLowerCase();
  if (sectorHint.includes('financial') || sectorHint.includes('bank'))
    score.financial += 3;
  if (sectorHint.includes('utility') || sectorHint.includes('electric'))
    score.utility += 3;
  if (sectorHint.includes('software') || sectorHint.includes('saas'))
    score.saas += 2;

  if (snapshot.grossMargin !== null) {
    if (snapshot.grossMargin >= 60) score.saas += 2;
    if (snapshot.grossMargin <= 30) {
      score.retail += 1;
      score.industrial += 1;
    }
  }
  if (snapshot.inventoryToAssets !== null && snapshot.inventoryToAssets > 8)
    score.retail += 2;
  if (snapshot.capexSales !== null) {
    if (snapshot.capexSales > 8) {
      score.industrial += 2;
      score.utility += 1;
    }
    if (snapshot.capexSales < 4) score.saas += 1;
  }
  if (snapshot.netDebtEbitda !== null && snapshot.netDebtEbitda > 3)
    score.utility += 1;

  if (snapshot.goodwillIntangiblesToAssets !== null) {
    if (snapshot.goodwillIntangiblesToAssets > 30) score.saas += 1;
    if (snapshot.goodwillIntangiblesToAssets < 10) score.industrial += 1;
  }
  if (snapshot.rdSales !== null) {
    if (snapshot.rdSales > 10) score.saas += 1;
    if (snapshot.rdSales < 2) score.utility += 1;
  }
  if (snapshot.sbcSales !== null) {
    if (snapshot.sbcSales > 4) score.saas += 1;
    if (snapshot.sbcSales < 1) score.industrial += 1;
  }
  if (snapshot.ppeAssets !== null) {
    if (snapshot.ppeAssets > 35) {
      score.industrial += 1;
      score.utility += 1;
    }
    if (snapshot.ppeAssets < 15) score.saas += 1;
  }

  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const [winner, pts] = sorted[0] || ['default', 0];
  const secondPts = sorted[1]?.[1] || 0;
  return {
    profile: pts >= 2 && pts - secondPts >= 1 ? winner : 'default',
    confidence: Math.min(1, pts / 6)
  };
}

export function parseCustomProfile() {
  const txt = document.getElementById('customProfileInput')?.value?.trim();
  if (!txt) return null;
  try {
    const cfg = JSON.parse(txt);
    return cfg && typeof cfg === 'object' ? cfg : null;
  } catch {
    return null;
  }
}

// Helper to create a standard analysis item
const METRIC_TIPS = {
  harmony:
    'Harmony (armonía): statements agree on growth, profitability, and cash quality.',
  grossMargin: 'Gross Margin (margen bruto): % of revenue left after COGS.',
  netMargin: 'Net Margin (margen neto): % of revenue kept as net income.',
  moat: 'Moat (foso competitivo): durable advantage protecting profits.',
  dilution: 'Dilution (dilución): more shares reduce ownership per share.',
  accruals: 'Accruals (devengos): accounting profit not yet backed by cash.',
  fcf: 'Free Cash Flow (flujo de caja libre): CFO minus capex.',
  sbc: 'Stock-based comp (compensación en acciones): non-cash now, real dilution later.',
  netDebt: 'Net Debt (deuda neta): debt minus cash and short-term investments.',
  deferredRevenue:
    'Deferred revenue (ingresos diferidos): cash collected before service delivery.'
};


function itemScore(item) {
  const signalScore =
    item.signal === 'bull' ? 1 : item.signal === 'bear' ? -1 : 0;
  return signalScore * (item.confidence ?? 0.5);
}

function sectionGrade(items) {
  const scored = (items || []).filter((i) => i.signal !== 'info');
  const totalW = scored.reduce((acc, i) => acc + (i.confidence ?? 0.5), 0) || 1;
  const score = scored.reduce((acc, i) => acc + itemScore(i), 0) / totalW;

  if (score >= 0.55) return 'excellent';
  if (score >= 0.2) return 'good';
  if (score <= -0.35) return 'poor';
  return 'average';
}

function deriveScoreRule(name, detail, signalText, explanation) {
  const n = String(name || '').toLowerCase();
  if (n.includes('current ratio'))
    return "signal = latest > 1.5 ? 'bull' : latest > 1.0 ? 'neutral' : 'bear'; label = latest > 2.0 ? 'Very Healthy' : latest > 1.5 ? 'Healthy' : latest > 1.0 ? 'Adequate' : 'Tight Liquidity ⚠️'";
  if (n.includes('quick ratio'))
    return "signal = latest > 1.2 ? 'bull' : latest > 0.8 ? 'neutral' : 'bear'; label = latest > 1.5 ? 'Very Liquid' : latest > 1.2 ? 'Healthy' : latest > 0.8 ? 'OK' : 'Low Liquidity ⚠️'; excludes inventory";
  if (n.includes('debt / equity'))
    return "signal = latest < 30 ? 'bull' : latest < 80 ? 'neutral' : 'bear'";
  if (n.includes('net debt / ebitda'))
    return "signal = latest < 0 ? 'bull' : latest < 2 ? 'neutral' : 'bear'";
  if (n.includes('revenue growth (cagr)'))
    return "signal = cagr > 15 ? 'bull' : cagr > 8 ? 'neutral' : 'bear'";
  if (n.includes('roic'))
    return JSON.stringify({
      metric: 'roic',
      bull: "metricThreshold('roic', profile, 'bull')",
      neutral: "metricThreshold('roic', profile, 'neutral')",
      direction: 'higher'
    });
  if (n.includes('total equity'))
    return "signal = latest > 0 && trend==='up' ? 'bull' : latest > 0 ? 'neutral' : 'bear'";
  return explanation || detail || signalText || '';
}

function simplifyScoreRule(scoreRule = '') {
  const rule = String(scoreRule || '').trim();
  if (!rule) return '';

  if (rule.startsWith('{') && rule.endsWith('}')) {
    try {
      const parsed = JSON.parse(rule);
      const direction = parsed.direction === 'lower' ? 'lower' : 'higher';
      const neutralText =
        typeof parsed.neutral === 'string' ? parsed.neutral : 'neutral threshold';
      const bullText =
        typeof parsed.bull === 'string' ? parsed.bull : 'bull threshold';
      return direction === 'higher'
        ? `higher is better; below ${neutralText} is weak, above ${bullText} is strong`
        : `lower is better; above ${neutralText} is weak, below ${bullText} is strong`;
    } catch {
      return rule;
    }
  }

  return rule
    .replace(/\s+/g, ' ')
    .replace(/latest/g, 'latest value')
    .replace(/cagr/g, 'CAGR')
    .replace(/trend===/g, 'trend = ')
    .trim();
}

const METRIC_INTERPRETATION_LIBRARY = [
  {
    pattern:
      /(revenue growth|yoy|cagr|eps growth|ebitda growth|operating income growth|net income growth|fcf growth|consensus (revenue|eps|ebitda|fcf))/i,
    en: {
      definition:
        'Measures business expansion; combine absolute growth with per-share growth and volatility.',
      lookFor:
        'Prefer steady growth with stable/improving margins, not one-off spikes.',
      thresholds:
        'General guide: <5% weak, 5-10% acceptable, 10-15% good, >15% strong (context/sector dependent).',
      pitfalls:
        'M&A, buybacks, tax effects and base effects can overstate core growth quality.',
      nextQuestions:
        'How much is price vs volume vs mix? Organic vs acquired?'
    },
    es: {
      definition:
        'Mide expansión del negocio; combina crecimiento absoluto, por acción y volatilidad.',
      lookFor:
        'Mejor crecimiento estable con márgenes defendidos/crecientes, no picos puntuales.',
      thresholds:
        'Guía general: <5% débil, 5-10% aceptable, 10-15% bueno, >15% fuerte (según sector).',
      pitfalls:
        'M&A, recompras, impuestos y efecto base pueden inflar el crecimiento “core”.',
      nextQuestions:
        '¿Cuánto viene de precio, volumen o mix? ¿Orgánico vs adquirido?'
    }
  },
  {
    pattern: /(gross margin|ebit margin|operating margin|ebitda margin|fcf margin)/i,
    en: {
      definition:
        'Shows pricing power and operating discipline converted into profitability.',
      lookFor:
        'Level + trend + stability; stable mid-level can be better than volatile high margins.',
      thresholds:
        'Compare with peers/history; persistent expansion is positive, sustained compression is a warning.',
      pitfalls:
        'Temporary cuts in R&D/marketing may boost margins now but hurt long-term moat.',
      nextQuestions:
        'Is margin change driven by mix, pricing, or temporary cost actions?'
    },
    es: {
      definition:
        'Refleja poder de precios y disciplina operativa convertidos en rentabilidad.',
      lookFor:
        'Nivel + tendencia + estabilidad; margen medio estable puede ser mejor que uno alto volátil.',
      thresholds:
        'Comparar con peers/historia; expansión sostenida es positiva, compresión sostenida alerta.',
      pitfalls:
        'Recortar I+D/marketing puede inflar margen hoy y debilitar el foso mañana.',
      nextQuestions:
        '¿El cambio viene de mix, pricing o recortes temporales?'
    }
  },
  {
    pattern: /(cogs|opex|sg&a|sga|stock-based|sbc)/i,
    en: {
      definition:
        'Tracks cost structure quality and whether scale improves unit economics.',
      lookFor:
        'For most cost ratios lower is better, except R&D where too low can underinvest future growth.',
      thresholds:
        'Evaluate trend and peer percentile rather than one static threshold.',
      pitfalls:
        'Accounting policy changes (capitalized costs, classification changes) can distort comparability.',
      nextQuestions:
        'Are costs structurally improving or temporarily deferred/capitalized?'
    },
    es: {
      definition:
        'Mide la calidad de la estructura de costes y si la escala mejora la economía unitaria.',
      lookFor:
        'En la mayoría de ratios de coste, bajar es mejor; en I+D, demasiado bajo puede ser mala señal.',
      thresholds:
        'Usar tendencia y percentil frente a peers más que un umbral fijo.',
      pitfalls:
        'Cambios contables (capitalización/reclasificación) pueden distorsionar comparaciones.',
      nextQuestions:
        '¿Mejora estructural real o costes diferidos/capitalizados?'
    }
  },
  {
    pattern: /(roe|roa|roic|equity multiplier)/i,
    en: {
      definition:
        'Measures return efficiency on shareholder capital and assets.',
      lookFor:
        'High returns are best when leverage is moderate and consistency is strong.',
      thresholds:
        'ROIC above cost of capital creates value; very high ROE with high leverage needs caution.',
      pitfalls:
        'Low/negative equity can mechanically inflate ROE without better economics.',
      nextQuestions:
        'How much return comes from true profitability vs leverage?'
    },
    es: {
      definition:
        'Mide eficiencia de retorno sobre capital del accionista y activos.',
      lookFor:
        'Retornos altos son mejores con apalancamiento moderado y consistencia.',
      thresholds:
        'ROIC por encima del coste de capital crea valor; ROE muy alto con alta deuda exige cautela.',
      pitfalls:
        'Equity bajo/negativo puede inflar ROE sin mejora económica real.',
      nextQuestions:
        '¿Cuánto del retorno viene de rentabilidad real vs apalancamiento?'
    }
  },
  {
    pattern:
      /(cash .*assets|receivable|dso|inventory|inventory yoy|goodwill|intangibles|retained earnings|total equity|working capital|deferred revenue)/i,
    en: {
      definition:
        'Describes balance-sheet composition, quality, and resilience under stress.',
      lookFor:
        'Receivables/inventory days should be stable; interpret negative working capital with CCC and business model.',
      thresholds:
        'No universal target: compare trend against peers and cycle phase.',
      pitfalls:
        'Negative retained earnings can come from heavy buybacks/dividends, not only historical losses.',
      nextQuestions:
        'Is balance strength improving, or funding growth with supplier/customer float?'
    },
    es: {
      definition:
        'Describe composición, calidad y resiliencia del balance ante estrés.',
      lookFor:
        'Días de cobro/inventario deberían ser estables; capital circulante negativo se interpreta con CCC.',
      thresholds:
        'No hay objetivo universal: comparar tendencia, peers y fase del ciclo.',
      pitfalls:
        'Beneficios retenidos negativos pueden venir de recompras/dividendos, no solo de pérdidas históricas.',
      nextQuestions:
        '¿El balance mejora o el crecimiento se financia con float de proveedores/clientes?'
    }
  },
  {
    pattern:
      /(debt|liabilit|current ratio|quick ratio|interest coverage|ffo|net debt|net cash|cash \/ short-term debt|deleverag|leverage|capital)/i,
    en: {
      definition:
        'Assesses solvency, refinancing risk, and debt-servicing capacity.',
      lookFor:
        'Read leverage with interest coverage, maturity profile, and cash position together.',
      thresholds:
        'General ranges: Net debt/EBITDA 0-2x healthy, 3-5x stressed; coverage should stay comfortably >3-5x.',
      pitfalls:
        'Some models (e.g., negative CCC retailers) tolerate low current ratios better than average firms.',
      nextQuestions:
        'Is debt rising to fund productive reinvestment or financial engineering?'
    },
    es: {
      definition:
        'Evalúa solvencia, riesgo de refinanciación y capacidad de servicio de deuda.',
      lookFor:
        'Leer apalancamiento junto con cobertura de intereses, vencimientos y caja.',
      thresholds:
        'Rangos generales: Deuda neta/EBITDA 0-2x saludable, 3-5x estresado; cobertura idealmente >3-5x.',
      pitfalls:
        'Algunos modelos (ej. retail con CCC negativo) soportan current ratio bajo mejor que otros.',
      nextQuestions:
        '¿La deuda sube para reinversión productiva o para ingeniería financiera?'
    }
  },

  {
    pattern:
      /(asset turnover|receivables turnover|inventory turnover|cash conversion cycle|days sales outstanding|days payable outstanding|fixed assets turnover|working capital turnover|operating cash flow \/ current liabilities|revenue per employee|fcf \/ cfo)/i,
    en: {
      definition:
        'Measures operating productivity of assets, working capital, and process efficiency.',
      lookFor:
        'Assess trend + peer comparison; improvements should come from utilization, not just asset shrinkage.',
      thresholds:
        'No single universal range; interpret by sector intensity and business model.',
      pitfalls:
        'Inflation, M&A perimeter changes, and outsourcing can mechanically move efficiency ratios.',
      nextQuestions:
        'Are efficiency gains structural, or mostly accounting/perimeter effects?'
    },
    es: {
      definition:
        'Mide productividad operativa de activos, capital circulante y procesos.',
      lookFor:
        'Evaluar tendencia + comparación con peers; mejoras deben venir de utilización real.',
      thresholds:
        'No hay un rango universal; depende de intensidad sectorial y modelo de negocio.',
      pitfalls:
        'Inflación, cambios de perímetro (M&A) y outsourcing pueden mover ratios mecánicamente.',
      nextQuestions:
        '¿La mejora de eficiencia es estructural o efecto contable/perímetro?'
    }
  },
  {
    pattern:
      /(cash from operations|cfo|cash conversion|capex|^free cash flow$|fcf uses summary|sbc as % of fcf|sbc as % of net income|net change in cash)/i,
    en: {
      definition:
        'Measures cash quality and operating efficiency beyond accounting earnings.',
      lookFor:
        'Best signals are consistent CFO/FCF aligned with revenue and EBIT trends.',
      thresholds:
        'CFO/NI above ~1 over time is usually healthy; interpret Capex/CFO by industry intensity.',
      pitfalls:
        'Working-capital swings can temporarily inflate or depress FCF.',
      nextQuestions:
        'Is cash generation recurring, or mostly timing effects from receivables/payables/inventory?'
    },
    es: {
      definition:
        'Mide calidad de caja y eficiencia operativa más allá del beneficio contable.',
      lookFor:
        'La mejor señal es CFO/FCF consistente y alineado con ingresos y EBIT.',
      thresholds:
        'CFO/NI >~1 en el tiempo suele ser saludable; Capex/CFO depende de intensidad del sector.',
      pitfalls:
        'El capital circulante puede inflar o deprimir el FCF de forma temporal.',
      nextQuestions:
        '¿La generación de caja es recurrente o efecto timing de cobros/pagos/inventario?'
    }
  },
  {
    pattern:
      /(ev|market cap|p\/e|price\/sales|price\/book|ev\/ebitda|ev\/ebit|ncav|yield|dividend yield|valuation|multiple|free cash flow \(ntm\)|levered fcf)/i,
    en: {
      definition:
        'Prices the business versus earnings, cash flow, assets, or sales.',
      lookFor:
        'Use valuation with growth durability, margins, and balance-sheet risk—not in isolation.',
      thresholds:
        'Ranges are regime- and sector-dependent; compare to own history and close peers.',
      pitfalls:
        'If EV/market cap are zero/contradictory, treat as data mapping issue and validate inputs.',
      nextQuestions:
        'What growth and margin assumptions are implied by today\'s multiple?'
    },
    es: {
      definition:
        'Valora el negocio frente a beneficios, caja, activos o ventas.',
      lookFor:
        'Usar valoración junto con durabilidad del crecimiento, márgenes y riesgo de balance.',
      thresholds:
        'Los rangos dependen del sector/régimen; comparar con su historia y peers cercanos.',
      pitfalls:
        'Si EV/market cap salen en cero o contradictorios, tratarlo como posible bug de datos.',
      nextQuestions:
        '¿Qué supuestos de crecimiento y margen está descontando el múltiplo actual?'
    }
  },
  {
    pattern:
      /(dividend|payout|buyback|shares outstanding|total shareholder return|shareholder return|tsr|capital return)/i,
    en: {
      definition:
        'Tracks how cash is returned to shareholders and whether return policy is sustainable.',
      lookFor:
        'Prefer returns funded by recurring FCF, not debt spikes.',
      thresholds:
        'Very high payout (>~80%) can reduce resilience unless cash flow is ultra-stable.',
      pitfalls:
        'Buybacks create value only if done at sensible prices and not offset by high SBC dilution.',
      nextQuestions:
        'Is per-share value compounding after netting SBC and debt-funded buybacks?'
    },
    es: {
      definition:
        'Mide cómo se devuelve caja al accionista y si esa política es sostenible.',
      lookFor:
        'Mejor retornos financiados con FCF recurrente, no con picos de deuda.',
      thresholds:
        'Payout muy alto (>~80%) reduce resiliencia salvo caja extremadamente estable.',
      pitfalls:
        'Recompras crean valor solo si se hacen a precios razonables y sin dilución neta por SBC.',
      nextQuestions:
        '¿Compone el valor por acción tras ajustar SBC y recompras financiadas con deuda?'
    }
  },
  {
    pattern: /(harmony|accrual|consistency|red flag|sanity|reality check)/i,
    en: {
      definition:
        'Cross-check layer: verifies whether growth, earnings, and cash tell the same story.',
      lookFor:
        'Prefer aligned trends across revenue, EBIT/NI, and CFO/FCF.',
      thresholds:
        'No hard threshold; repeated divergences require deeper forensic review.',
      pitfalls:
        'One-year mismatches can be normal, but persistent gaps often signal quality risk.',
      nextQuestions:
        'What single assumption would reconcile accounting profit with cash outcomes?'
    },
    es: {
      definition:
        'Capa de contraste: verifica si crecimiento, beneficios y caja cuentan la misma historia.',
      lookFor:
        'Preferible ver tendencias alineadas en ingresos, EBIT/NI y CFO/FCF.',
      thresholds:
        'Sin umbral fijo; divergencias repetidas requieren análisis forense.',
      pitfalls:
        'Un año aislado puede ser normal, pero brechas persistentes elevan riesgo de calidad.',
      nextQuestions:
        '¿Qué supuesto reconcilia mejor el beneficio contable con la caja real?'
    }
  }
];



const METRIC_INTERPRETATION_EXACT = {
  'margin expansion vs gross': {
    en: {
      definition:
        'Compares gross-margin change versus operating-margin change to see if overhead amplifies or offsets gross improvements.',
      lookFor:
        'Healthy pattern: operating margin expands at least as much as gross margin over time.',
      thresholds:
        'No fixed threshold; assess sign and persistence of gross Δ vs operating Δ across cycles.',
      pitfalls:
        'Short-term cost cuts or accounting reclassifications can temporarily inflate operating margin expansion.',
      nextQuestions:
        'Is the operating-margin move structural (efficiency/scale) or temporary (cuts/timing)?'
    },
    es: {
      definition:
        'Compara el cambio del margen bruto frente al cambio del margen operativo para ver si el overhead amplifica o absorbe la mejora bruta.',
      lookFor:
        'Patrón sano: el margen operativo se expande al menos tanto como el margen bruto.',
      thresholds:
        'Sin umbral fijo; importa el signo y la persistencia de Δ bruto vs Δ operativo en el ciclo.',
      pitfalls:
        'Recortes temporales o reclasificaciones contables pueden inflar artificialmente la expansión operativa.',
      nextQuestions:
        '¿El cambio de margen operativo es estructural (eficiencia/escala) o temporal (recortes/timing)?'
    }
  },
  'operating leverage': {
    en: {
      definition:
        'Proxy check of operating leverage using gross-margin delta vs operating-margin delta (margin expansion/compression lens).',
      lookFor:
        'Healthy pattern: operating margin expands at least as much as gross margin over time.',
      thresholds:
        'No fixed threshold; assess sign and persistence of gross Δ vs operating Δ across cycles.',
      pitfalls:
        'This is a margin-based proxy, not pure Δ%EBIT/Δ%Sales operating leverage.',
      nextQuestions:
        'Do margin changes reflect structural efficiency or temporary cost actions?'
    },
    es: {
      definition:
        'Chequeo proxy de apalancamiento operativo usando Δ margen bruto vs Δ margen operativo (lente de expansión/compresión de márgenes).',
      lookFor:
        'Patrón sano: el margen operativo se expande al menos tanto como el margen bruto.',
      thresholds:
        'Sin umbral fijo; importa el signo y la persistencia de Δ bruto vs Δ operativo.',
      pitfalls:
        'Es una aproximación por márgenes, no el apalancamiento puro Δ%EBIT/Δ%Ventas.',
      nextQuestions:
        '¿Los cambios de margen vienen de eficiencia estructural o de recortes temporales?'
    }
  },
  'revenue growth (cagr)': {
    en: {
      definition: 'Annualized revenue growth over the effective window (smoothed path, not volatility).',
      lookFor: 'Read together with margin durability and source of growth quality.',
      thresholds: 'Contextual by sector/maturity; consistency usually matters more than one peak year.',
      pitfalls: 'M&A and base effects can distort comparability across windows.',
      nextQuestions: 'How much of growth is organic versus acquired?'
    },
    es: {
      definition: 'Crecimiento anualizado de ingresos en la ventana efectiva (trayectoria suavizada, no volatilidad).',
      lookFor: 'Leer junto con durabilidad de márgenes y calidad de la fuente de crecimiento.',
      thresholds: 'Depende de sector/madurez; la consistencia suele importar más que un pico aislado.',
      pitfalls: 'M&A y efectos base pueden distorsionar comparabilidad entre ventanas.',
      nextQuestions: '¿Qué parte del crecimiento es orgánica versus adquirida?'
    }
  },
  'revenue yoy growth': {
    en: {
      definition: 'Single-period year-over-year revenue growth, useful for momentum and cyclicality.',
      lookFor: 'Compare latest YoY with multi-year average and dispersion (σ).',
      thresholds: 'No universal threshold; stability and trend shape matter.',
      pitfalls: 'One-year shocks can overstate momentum.',
      nextQuestions: 'Is current YoY supported by demand and repeatable drivers?'
    },
    es: {
      definition: 'Crecimiento interanual de ingresos de un periodo, útil para momentum y ciclicidad.',
      lookFor: 'Comparar YoY actual con media multianual y dispersión (σ).',
      thresholds: 'Sin umbral universal; importan estabilidad y forma de tendencia.',
      pitfalls: 'Shocks de un año pueden exagerar el momentum.',
      nextQuestions: '¿El YoY actual está respaldado por demanda y drivers repetibles?'
    }
  },
  'eps growth (diluted)': {
    en: {
      definition: 'Tracks per-share earnings compounding after share-count effects.',
      lookFor: 'Contrast EPS growth versus net income growth and dilution/buyback trends.',
      thresholds: 'Sustained real growth is preferable to one-off tax/accounting jumps.',
      pitfalls: 'Buybacks, tax changes, and SBC can move EPS without equivalent operating improvement.',
      nextQuestions: 'How much EPS growth comes from operations vs capital-allocation effects?'
    },
    es: {
      definition: 'Mide el crecimiento del beneficio por acción tras efectos de recuento de acciones.',
      lookFor: 'Contrastar crecimiento de BPA con beneficio neto y tendencia de dilución/recompras.',
      thresholds: 'Mejor crecimiento sostenido real que saltos puntuales fiscales/contables.',
      pitfalls: 'Recompras, impuestos y SBC pueden mover BPA sin mejora operativa equivalente.',
      nextQuestions: '¿Qué parte del BPA viene de operación vs asignación de capital?'
    }
  },
  'stock-based comp as % of revenue': {
    en: {
      definition: 'Measures equity-based compensation intensity versus revenue and dilution pressure.',
      lookFor: 'Track alongside diluted shares and net buyback effectiveness.',
      thresholds: 'Lower/stable is usually healthier for per-share value creation.',
      pitfalls: 'Treating SBC as “non-cash” can overstate underlying profitability quality.',
      nextQuestions: 'Are buybacks offsetting SBC dilution on a net basis?'
    },
    es: {
      definition: 'Mide la intensidad de compensación en acciones sobre ingresos y la presión de dilución.',
      lookFor: 'Seguir junto con acciones diluidas y efectividad neta de recompras.',
      thresholds: 'Más bajo/estable suele ser más sano para crear valor por acción.',
      pitfalls: 'Tratar SBC como “no caja” puede sobreestimar la calidad del beneficio subyacente.',
      nextQuestions: '¿Las recompras compensan la dilución por SBC en términos netos?'
    }
  },
  'revenue vs earnings harmony': {
    en: {
      definition: 'Checks whether sales growth and earnings growth move coherently.',
      lookFor: 'Persistent divergence may indicate margin pressure, mix shifts, or one-offs.',
      thresholds: 'No hard threshold; repeated spread and direction conflicts are key.',
      pitfalls: 'A single year mismatch can be normal in cyclical or transition periods.',
      nextQuestions: 'What explains the revenue-earnings gap: margins, mix, tax, or accounting items?'
    },
    es: {
      definition: 'Comprueba si el crecimiento de ventas y de beneficios se mueve de forma coherente.',
      lookFor: 'Divergencias persistentes pueden señalar presión de márgenes, cambios de mix o one-offs.',
      thresholds: 'Sin umbral fijo; importan las brechas repetidas y conflictos de dirección.',
      pitfalls: 'Un año con desajuste puede ser normal en ciclos/transiciones.',
      nextQuestions: '¿Qué explica la brecha ventas-beneficios: márgenes, mix, fiscalidad o contabilidad?'
    }
  },
  'cfo vs net income (accrual risk)': {
    en: {
      definition: 'Assesses whether accounting earnings are backed by operating cash generation.',
      lookFor: 'Ratios near/above 1x over time usually indicate stronger earnings quality.',
      thresholds: 'Sustained sub-1x conversion deserves scrutiny.',
      pitfalls: 'Working-capital timing can temporarily distort one period.',
      nextQuestions: 'Is weak conversion structural or timing-driven?'
    },
    es: {
      definition: 'Evalúa si el beneficio contable está respaldado por generación de caja operativa.',
      lookFor: 'Ratios cercanos/superiores a 1x en el tiempo suelen implicar mejor calidad de beneficios.',
      thresholds: 'Conversión sostenida por debajo de 1x merece revisión.',
      pitfalls: 'El timing de capital circulante puede distorsionar un periodo aislado.',
      nextQuestions: '¿La conversión débil es estructural o de timing?'
    }
  },
  'fcf consistency check': {
    en: {
      definition: 'Checks whether free cash flow trend confirms revenue and earnings trends.',
      lookFor: 'Prefer cash trend that follows or validates accounting performance.',
      thresholds: 'Repeated “profits up / FCF flat-down” patterns are warning signals.',
      pitfalls: 'Capex cycles can create temporary divergence.',
      nextQuestions: 'Is divergence due to reinvestment cycle or weaker cash conversion quality?'
    },
    es: {
      definition: 'Comprueba si la tendencia del FCF confirma la tendencia de ingresos y beneficios.',
      lookFor: 'Preferible que la caja acompañe/valide el desempeño contable.',
      thresholds: 'Patrones repetidos de “beneficios al alza / FCF plano-bajista” son alerta.',
      pitfalls: 'Ciclos de capex pueden crear divergencias temporales.',
      nextQuestions: '¿La divergencia es ciclo de reinversión o menor calidad de conversión a caja?'
    }
  },
  'cash / assets': {
    en: {
      definition: 'Cash and near-cash buffer as a share of assets; indicates liquidity resilience and optionality.',
      lookFor: 'Evaluate buffer size, trend, and whether liquidity supports capex, M&A, debt service, and buybacks.',
      thresholds: 'Contextual by model and cyclicality; very low buffers increase shock sensitivity.',
      pitfalls: 'Not all cash is equally available (restricted, trapped, or operational minimum cash).',
      nextQuestions: 'How much of reported cash is truly deployable under stress?'
    },
    es: {
      definition: 'Colchón de caja y cuasi-caja sobre activos; indica resiliencia de liquidez y opcionalidad.',
      lookFor: 'Evaluar tamaño, tendencia y si soporta capex, M&A, servicio de deuda y recompras.',
      thresholds: 'Depende de modelo y ciclicidad; buffers muy bajos elevan sensibilidad a shocks.',
      pitfalls: 'No toda la caja es igual de disponible (restringida, atrapada o mínima operativa).',
      nextQuestions: '¿Qué parte de la caja reportada es realmente desplegable en estrés?'
    }
  },
  'forward p/e (ntm)': {
    en: {
      definition: 'Values next-twelve-month expected earnings; embeds growth, margin, and risk expectations.',
      lookFor: 'Interpret with earnings quality and estimate reliability, not as a standalone buy/sell signal.',
      thresholds: 'Relative context matters: own history, peers, and rates regime.',
      pitfalls: 'Forward EPS can be revised quickly, making optically cheap/expensive levels unstable.',
      nextQuestions: 'What EPS revision path is implied at the current multiple?'
    },
    es: {
      definition: 'Valora beneficios esperados a 12 meses; incorpora expectativas de crecimiento, márgenes y riesgo.',
      lookFor: 'Interpretar con calidad de beneficios y fiabilidad de estimaciones, no de forma aislada.',
      thresholds: 'Importa el contexto relativo: historia propia, peers y régimen de tipos.',
      pitfalls: 'El EPS forward puede revisarse rápido; lo “barato/caro” puede cambiar pronto.',
      nextQuestions: '¿Qué trayectoria de revisiones de EPS exige el múltiplo actual?'
    }
  },
  'price / sales': {
    en: {
      definition: 'Values each unit of revenue; useful when margins are cyclical or earnings are noisy.',
      lookFor: 'Read with gross/operating margin structure and conversion to free cash flow.',
      thresholds: 'Higher P/S is more justified with durable margins and strong cash conversion.',
      pitfalls: 'Revenue growth without margin quality can make P/S look cheaper than economics justify.',
      nextQuestions: "What normalized margin and FCF conversion are implied by today's P/S?"
    },
    es: {
      definition: 'Valora cada unidad de ingresos; útil cuando márgenes son cíclicos o beneficios ruidosos.',
      lookFor: 'Leer junto con estructura de márgenes y conversión a FCF.',
      thresholds: 'Un P/S alto se justifica más con márgenes duraderos y fuerte conversión a caja.',
      pitfalls: 'Crecimiento de ingresos sin calidad de margen puede hacer parecer el P/S más barato de lo real.',
      nextQuestions: '¿Qué margen normalizado y conversión a FCF descuenta el P/S actual?'
    }
  },
  'price / book value': {
    en: {
      definition: 'Values equity relative to accounting book value.',
      lookFor: 'Most useful with asset-heavy/financial models and when book value quality is high.',
      thresholds: 'Interpret with return on equity and capital intensity.',
      pitfalls: 'For intangibles-heavy firms, book value may understate economic moat assets.',
      nextQuestions: 'Is high P/B explained by sustainably high ROE or by accounting distortions?'
    },
    es: {
      definition: 'Valora el patrimonio frente al valor contable.',
      lookFor: 'Más útil en modelos intensivos en activos/financieros y con buena calidad contable del book.',
      thresholds: 'Interpretar junto con ROE e intensidad de capital.',
      pitfalls: 'En compañías intensivas en intangibles, el valor contable puede infrarrepresentar activos económicos.',
      nextQuestions: '¿Un P/B alto se explica por ROE sostenible o por distorsiones contables?'
    }
  },
  'ev / ebitda (ntm)': {
    en: {
      definition: 'Enterprise-value multiple over expected EBITDA, capital-structure neutral at headline level.',
      lookFor: 'Use with reinvestment needs (capex) and cash conversion to avoid EBITDA-only bias.',
      thresholds: 'Contextual vs peers/history and rates regime.',
      pitfalls: 'Ignores capex intensity and working-capital demands; two firms with same EV/EBITDA can differ greatly in FCF.',
      nextQuestions: 'How much EBITDA converts to owner cash after reinvestment?'
    },
    es: {
      definition: 'Múltiplo de valor de empresa sobre EBITDA esperado, neutral a estructura de capital en titular.',
      lookFor: 'Usarlo con necesidades de reinversión (capex) y conversión a caja para evitar sesgo EBITDA-only.',
      thresholds: 'Contextual vs peers/historia y régimen de tipos.',
      pitfalls: 'Ignora intensidad de capex y capital circulante; mismo EV/EBITDA puede implicar FCF muy distinto.',
      nextQuestions: '¿Cuánto EBITDA se convierte en caja para el accionista tras reinversión?'
    }
  },
  'ev / ebit (ntm)': {
    en: {
      definition: 'Enterprise-value multiple over expected operating profit after depreciation.',
      lookFor: 'More informative than EV/EBITDA when depreciation tracks real asset consumption.',
      thresholds: 'Interpret relatively, not as absolute good/bad levels.',
      pitfalls: 'Accounting depreciation may still differ from true maintenance capex.',
      nextQuestions: 'Is EBIT a good proxy for sustainable operating earning power here?'
    },
    es: {
      definition: 'Múltiplo de valor de empresa sobre beneficio operativo esperado tras depreciación.',
      lookFor: 'Más informativo que EV/EBITDA cuando la depreciación refleja consumo real de activos.',
      thresholds: 'Interpretación relativa, no umbrales absolutos rígidos.',
      pitfalls: 'La depreciación contable puede diferir del capex de mantenimiento real.',
      nextQuestions: '¿El EBIT aproxima bien el poder de beneficio operativo sostenible?'
    }
  },
  'total shareholder yield': {
    en: {
      definition: 'Dividends plus net buybacks relative to market cap; a direct shareholder cash-return lens.',
      lookFor: 'Prefer sustainable yields funded by recurring FCF and stable balance sheet.',
      thresholds: 'Very high yields can be attractive but require unit/scope sanity checks.',
      pitfalls: 'Scaling/unit mismatches can produce impossible yields; avoid scoring until validated.',
      nextQuestions: 'Is net shareholder yield still strong after SBC dilution and debt effects?'
    },
    es: {
      definition: 'Dividendos más recompras netas sobre market cap; visión directa del retorno de caja al accionista.',
      lookFor: 'Preferir yields sostenibles financiados por FCF recurrente y balance estable.',
      thresholds: 'Yields muy altos pueden ser atractivos pero exigen chequeo de unidades/escala.',
      pitfalls: 'Errores de escala/unidades pueden generar yields imposibles; no puntuar hasta validar.',
      nextQuestions: '¿El yield al accionista sigue fuerte tras dilución por SBC y efectos de deuda?'
    }
  },
  'sg&a as % of revenue': {
    en: {
      definition: 'Measures sales/admin overhead efficiency relative to revenue.',
      lookFor:
        'Prefer stable/declining trend with scale, without damaging growth quality.',
      thresholds:
        'Compare trend and peer percentile; avoid single hard thresholds.',
      pitfalls:
        'Accounting reclassifications or cost capitalization can artificially improve the ratio.',
      nextQuestions:
        'Is lower SG&A genuine efficiency or accounting presentation?'
    },
    es: {
      definition: 'Mide la eficiencia del overhead comercial/administrativo sobre ingresos.',
      lookFor:
        'Ideal: tendencia estable o a la baja con escala, sin romper crecimiento.',
      thresholds:
        'Comparar tendencia y percentil frente a peers; evitar umbral único rígido.',
      pitfalls:
        'Reclasificaciones contables o capitalización de costes pueden “mejorar” el ratio artificialmente.',
      nextQuestions:
        '¿La mejora de SG&A es eficiencia real o presentación contable?'
    }
  },
  'effective tax rate': {
    en: {
      definition: 'Taxes paid over pre-tax income; proxy for tax efficiency and sustainability.',
      lookFor:
        'Focus on level + volatility and identify one-offs (credits, repatriation, jurisdiction changes).',
      thresholds:
        'Benchmark versus statutory tax rate and peers; high volatility is usually event-driven.',
      pitfalls:
        'One-off tax items can overstate/understate underlying profitability quality.',
      nextQuestions:
        'Is the current effective rate structural or a one-year event?'
    },
    es: {
      definition: 'Impuestos pagados sobre beneficio antes de impuestos; proxy de eficiencia fiscal.',
      lookFor:
        'Mirar nivel + estabilidad (σ) y detectar one-offs (créditos, repatriaciones, cambios de jurisdicción).',
      thresholds:
        'Comparar con tasa estatutaria y peers; volatilidad alta suele ser evento puntual.',
      pitfalls:
        'Partidas fiscales extraordinarias pueden distorsionar la calidad real del beneficio.',
      nextQuestions:
        '¿La tasa efectiva actual es sostenible o puntual?'
    }
  },
  'interest expense as % of revenue': {
    en: {
      definition: 'Financial burden relative to business size.',
      lookFor:
        'Read alongside net debt, interest coverage, and debt maturity wall.',
      thresholds:
        'Lower is better in general, but level must be interpreted with capital structure.',
      pitfalls:
        'Fixed vs floating debt mix can change sensitivity quickly when rates move.',
      nextQuestions:
        'Are interest costs structurally manageable under stress scenarios?'
    },
    es: {
      definition: 'Carga financiera relativa al tamaño del negocio.',
      lookFor:
        'Leer junto con deuda neta, cobertura de intereses y vencimientos.',
      thresholds:
        'En general más bajo es mejor, pero depende de la estructura de capital.',
      pitfalls:
        'La mezcla tipo fijo/variable cambia rápido la sensibilidad a tipos.',
      nextQuestions:
        '¿Los intereses son manejables también en escenarios de estrés?'
    }
  },
  'days payable outstanding (dpo)': {
    en: {
      definition: 'Average days the company takes to pay suppliers (supplier float).',
      lookFor:
        'Higher DPO can support cash, but should remain sustainable within supplier relationships.',
      thresholds:
        'Interpret versus peers and business model; very low/high can both be suboptimal.',
      pitfalls:
        'Rising DPO can reflect bargaining power or cash stress—context matters.',
      nextQuestions:
        'Is DPO strength operationally sustainable without supply-chain friction?'
    },
    es: {
      definition: 'Días promedio para pagar a proveedores (supplier float).',
      lookFor:
        'Un DPO alto mejora caja, pero debe ser sostenible sin tensionar proveedores.',
      thresholds:
        'Interpretar contra peers y modelo de negocio; extremos pueden ser subóptimos.',
      pitfalls:
        'Un DPO al alza puede ser poder de negociación o estrés de caja.',
      nextQuestions:
        '¿El DPO alto es sostenible sin fricción en la cadena de suministro?'
    }
  }

  ,
  'r&d as % of revenue': {
    en: {
      definition: 'R&D intensity shows innovation investment relative to revenue.',
      lookFor:
        'Track trend, peer comparison, and whether spending translates into product strength and durable margins.',
      thresholds:
        'No universal threshold; high-tech/healthcare structurally require higher R&D than mature sectors.',
      pitfalls:
        'Very low R&D can erode moat; very high R&D without monetization can pressure returns.',
      nextQuestions:
        'Is R&D spend creating durable revenue and margin outcomes?'
    },
    es: {
      definition: 'I+D sobre ingresos mide la intensidad de inversión en innovación.',
      lookFor:
        'Seguir tendencia, comparación con peers y si se traduce en producto/foso y márgenes sostenibles.',
      thresholds:
        'No hay umbral universal; tech/salud suelen requerir más I+D que sectores maduros.',
      pitfalls:
        'I+D muy baja puede erosionar el foso; muy alta sin retorno puede presionar rentabilidad.',
      nextQuestions:
        '¿El gasto en I+D se está convirtiendo en ingresos/márgenes duraderos?'
    }
  },
  'operating expenses as % of gross profit': {
    en: {
      definition: 'Measures how much gross profit is consumed by operating structure costs.',
      lookFor:
        'Generally lower is better if growth quality is preserved.',
      thresholds:
        'Trend and peer context matter; sustained rises usually reduce operating resilience.',
      pitfalls:
        'Planned growth investment can lift ratio temporarily; verify payback quality.',
      nextQuestions:
        'Is higher OpEx intensity temporary investment or structural inefficiency?'
    },
    es: {
      definition: 'Mide cuánto beneficio bruto consume la estructura de gastos operativos.',
      lookFor:
        'En general, más bajo es mejor si no compromete el crecimiento/foso.',
      thresholds:
        'Importa tendencia + peers; subidas sostenidas suelen reducir resiliencia operativa.',
      pitfalls:
        'Fases de inversión deliberada pueden elevar el ratio temporalmente; validar payback.',
      nextQuestions:
        '¿El mayor OpEx es inversión temporal o ineficiencia estructural?'
    }
  }

} as const;

function metricLibraryEntry(name = '') {
  const label = String(name || '').trim();
  const exact = METRIC_INTERPRETATION_EXACT[label.toLowerCase() as keyof typeof METRIC_INTERPRETATION_EXACT];
  if (exact) return exact;
  return (
    METRIC_INTERPRETATION_LIBRARY.find((entry) => entry.pattern.test(label)) ||
    null
  );
}

function buildMetricInterpretation(
  name,
  scoreRule,
  signal,
  signalText,
  detailText = '',
  explanationText = ''
) {
  const shortRule = simplifyScoreRule(scoreRule);
  const combinedContext = `${detailText} ${explanationText} ${signalText}`.toLowerCase();
  const sanityHint =
    currentLang === 'es'
      ? 'Chequeo de consistencia: si ves EV/Market Cap = 0, TSR extremo o métricas contradictorias (p.ej. net cash y net debt positivos a la vez), revisar extracción/unidades.'
      : 'Consistency check: if EV/Market Cap = 0, TSR is extreme, or metrics conflict (e.g., net cash and positive net debt simultaneously), review extraction/units.';

  const positiveBias =
    signal === 'bull'
      ? currentLang === 'es'
        ? 'Lectura actual favorable.'
        : 'Current read is favorable.'
      : signal === 'bear'
        ? currentLang === 'es'
          ? 'Lectura actual débil; vigilar deterioro.'
          : 'Current read is weak; monitor deterioration.'
        : currentLang === 'es'
          ? 'Lectura mixta/neutral en este momento.'
          : 'Current read is mixed/neutral.';

  const entry = metricLibraryEntry(name);
  const pack = entry ? (currentLang === 'es' ? entry.es : entry.en) : null;

  const fallbackDirection =
    signalText &&
    /(deleverag|deuda|cost|expense|days|dilution|accrual|tax|liquidity low|tight)/i.test(
      signalText
    )
      ? currentLang === 'es'
        ? 'Suele ser mejor que baje o se mantenga controlada.'
        : 'Usually better when it declines or stays controlled.'
      : currentLang === 'es'
        ? 'Suele ser mejor que suba de forma sostenible y estable.'
        : 'Usually better when it rises sustainably and steadily.';

  const specialHints = [];
  const metricName = String(name || '').toLowerCase();

  if (metricName.includes('retained earnings')) {
    specialHints.push(
      currentLang === 'es'
        ? 'Caso especial: beneficios retenidos negativos no siempre implican pérdidas históricas; también pueden reflejar recompras/dividendos acumulados.'
        : 'Special case: negative retained earnings do not always imply historical losses; they can also reflect cumulative buybacks/dividends.'
    );
  }

  if (metricName.includes('working capital turnover') && /latest:\s*-/.test(combinedContext)) {
    specialHints.push(
      currentLang === 'es'
        ? 'Caso especial: working capital turnover negativo debe leerse junto con CCC; puede indicar fortaleza por financiación de proveedores (float).'
        : 'Special case: negative working-capital turnover should be read with CCC; it can indicate supplier-float strength instead of weakness.'
    );
  }

  if ((metricName.includes('roe') || metricName.includes('return on equity')) && /(leverage|apalancamiento|multiplier|inflated roe)/.test(combinedContext)) {
    specialHints.push(
      currentLang === 'es'
        ? 'Caso especial: ROE muy alto puede estar inflado por apalancamiento/equity reducido; validar ROA y multiplicador de patrimonio.'
        : 'Special case: very high ROE can be leverage-inflated by small equity; validate ROA and the equity multiplier.'
    );
  }

  if (metricName.includes('enterprise value vs market cap') && /\$0\.0b|\b0\.0b\b|\b0\b/.test(combinedContext)) {
    specialHints.push(
      currentLang === 'es'
        ? '⚠️ Dato de valoración inconsistente: EV o Market Cap en cero sugiere fallo de extracción/mapeo/unidades.'
        : '⚠️ Inconsistent valuation datapoint: EV or Market Cap at zero suggests extraction/mapping/unit issues.'
    );
  }

  if (metricName.includes('net debt / net cash')) {
    specialHints.push(
      currentLang === 'es'
        ? 'Chequeo: usar definición consistente de caja (incluyendo o no inversiones a corto plazo) para evitar contradicciones entre secciones.'
        : 'Check: use a consistent cash definition (including or excluding short-term investments) to avoid cross-section contradictions.'
    );
  }

  if (metricName.includes('cash / short-term debt')) {
    specialHints.push(
      currentLang === 'es'
        ? 'Chequeo: cobertura baja aumenta riesgo de refinanciación inmediata, especialmente con crédito más restrictivo.'
        : 'Check: low coverage increases near-term refinancing risk, especially in tighter credit markets.'
    );
  }

  if (metricName.includes('total shareholder return') && /(\d{4,}|%)/.test(combinedContext)) {
    specialHints.push(
      currentLang === 'es'
        ? 'Sanity check: si el TSR parece imposible, revisar fórmula y unidades (porcentaje vs base monetaria).'
        : 'Sanity check: if TSR looks implausible, re-check formula and units (percentage vs monetary base).'
    );
  }

  const specialText = specialHints.length
    ? `\n• ${specialHints.join('\n• ')}`
    : '';

  if (pack) {
    return currentLang === 'es'
      ? `Interpretación: ${positiveBias}
• Qué significa: ${pack.definition}
• Qué mirar: ${pack.lookFor}
• Rangos guía: ${pack.thresholds}${shortRule ? ` | Regla del modelo: ${shortRule}.` : ''}
• Trampas habituales: ${pack.pitfalls}
• Pregunta clave: ${pack.nextQuestions}
• ${sanityHint}${specialText}`
      : `Interpretation: ${positiveBias}
• What it means: ${pack.definition}
• What to look for: ${pack.lookFor}
• Guide ranges: ${pack.thresholds}${shortRule ? ` | Model rule: ${shortRule}.` : ''}
• Common pitfalls: ${pack.pitfalls}
• Key question: ${pack.nextQuestions}
• ${sanityHint}${specialText}`;
  }

  return currentLang === 'es'
    ? `Interpretación: ${positiveBias} ${fallbackDirection}${shortRule ? ` Regla del modelo: ${shortRule}.` : ''}
• ${sanityHint}${specialText}`
    : `Interpretation: ${positiveBias} ${fallbackDirection}${shortRule ? ` Model rule: ${shortRule}.` : ''}
• ${sanityHint}${specialText}`;
}

function makeItem(
  name,
  detail,
  vals,
  signal,
  signalText,
  explanation,
  meta = {}
) {
  const rawScoreRule =
    meta.scoreRule || deriveScoreRule(name, detail, signalText, explanation);
  const detailText = detail || '';
  const interpretation = buildMetricInterpretation(
    name,
    rawScoreRule,
    signal || 'neutral',
    signalText || '',
    detailText,
    explanation || ''
  );
  const mergedDetail = detailText
    ? `${detailText}\n${interpretation}`
    : interpretation;

  return {
    name,
    detail: mergedDetail,
    values: vals || [],
    signal: signal || 'neutral',
    signalText: signalText || '',
    explanation: explanation || '',
    tip: meta.tip || '',
    highConfidence: meta.highConfidence !== false,
    confidence: getConfidence(vals || []),
    labels: meta.labels || vals?.labels || [],
    scoreRule: rawScoreRule
  };
}

export function analyze(data, profile = 'default', options = {}) {
  const results = {
    scores: {},
    sections: [],
    meta: { highConfidence: [], lowConfidence: [] }
  };
  const is = data.sections['Income Statement'];
  const bs = data.sections['Balance Sheet'];
  const cf = data.sections['Cash Flow'];
  const ratios = data.sections['Ratios'];
  const vm = data.sections['Valuation Multiples'];
  const apt = data.sections['Analyst Price Targets'];
  const ce = data.sections['Consensus Estimates'];
  let activeProfile = profile;
  let customThresholds = options.customThresholds || null;

  function mt(metric, kind) {
    if (
      customThresholds &&
      customThresholds[metric] &&
      typeof customThresholds[metric][kind] === 'number'
    ) {
      return customThresholds[metric][kind];
    }
    return metricThreshold(metric, activeProfile, kind);
  }

  // Helper to find row by partial label match (case-insensitive, multi-keyword)
  function findRow(section, ...keywords) {
    if (!section) return null;
    return section.rows.find((r) => {
      const l = [r.label, r.rawLabel, r.displayLabel, r.labelNormalized]
        .filter(Boolean)
        .join(' | ')
        .toLowerCase();
      const matches = keywords.every((k) => l.includes(k.toLowerCase()));
      if (!matches) return false;
      return r.values.some((v) => parseNumber(v) !== null);
    });
  }

  // Find row trying multiple keyword sets
  function findRowAny(section, ...keywordSets) {
    for (const kw of keywordSets) {
      const row = Array.isArray(kw)
        ? findRow(section, ...kw)
        : findRow(section, kw);
      if (row) return row;
    }
    return null;
  }

  function findRowExact(section, ...labels) {
    if (!section) return null;
    const normalized = labels.map((l) => l.toLowerCase().trim());
    return (
      section.rows.find((r) => {
        const l = r.label.toLowerCase().trim();
        return (
          normalized.includes(l) &&
          r.values.some((v) => parseNumber(v) !== null)
        );
      }) || null
    );
  }

  function sumLatestRows(section, ...keywordSets) {
    if (!section) return null;
    const rows = [];
    for (const kw of keywordSets) {
      const row = Array.isArray(kw)
        ? findRow(section, ...kw)
        : findRow(section, kw);
      if (row && !rows.includes(row)) rows.push(row);
    }
    if (!rows.length) return null;
    let total = 0;
    let found = false;
    for (const row of rows) {
      const val = getLatest(row);
      if (val !== null) {
        total += Math.abs(val);
        found = true;
      }
    }
    return found ? total : null;
  }

  // Pre-detect core rows with broader synonyms for robust parsing
  const revenueRow = findRowAny(
    is,
    'Ingresos totales',
    'Total Revenue',
    'Total Revenues',
    'Revenue As Reported',
    'Revenues',
    'Sales',
    'Ventas'
  );
  const grossProfitRow = findRowAny(
    is,
    'Gross Profit',
    'Beneficio bruto',
    'Ganancia bruta'
  );
  const opIncomeRowCore = findRowAny(
    is,
    'Operating Income',
    'EBIT',
    'Ingresos de explotación',
    'Resultado operativo'
  );
  const netIncomeRowCore = findRowAny(
    is,
    'Net Income',
    'Net earnings',
    'Beneficio neto',
    'Resultado neto'
  );
  const grossMarginRowCore = findRowAny(
    ratios,
    'Gross Margin',
    'Margen de beneficio bruto',
    'Margen bruto'
  );
  const capexCore = findRowAny(
    cf,
    'Capital Expenditures',
    'CapEx',
    'Gastos de capital',
    'Inversiones en capital'
  );
  const debtCore = findRowAny(bs, 'Total Debt', 'Deuda total');
  const invCore = findRowAny(bs, 'Inventory', 'Inventories', 'Inventarios');
  const assetsCore = findRowAny(bs, 'Total Assets', 'Activos totales');
  const goodwillCore = findRowAny(bs, 'Goodwill', 'Fondo de comercio');
  const intangiblesCore = findRowAny(bs, 'Other Intangibles', 'Intangible Assets', 'Activos intangibles');
  const rdCore = findRowAny(is, 'Research and Development', 'R&D', 'Gastos de investigación');
  const sbcProfileRow = findRowAny(cf, 'Stock-Based Compensation', 'Compensación basada en acciones');
  const ppeCore = findRowAny(bs, 'Net Property Plant And Equipment', 'PP&E', 'Propiedad, planta y equipo');
  const netDebtEbitdaCore = findRowAny(ratios, 'Net Debt / EBITDA', 'Deuda Neta / EBITDA');

  if (profile === 'auto') {
    const gm = getLatest(grossMarginRowCore);
    const revLatest = getLatest(revenueRow);
    const assetsLatest = getLatest(assetsCore);
    const capexSales =
      getLatest(capexCore) !== null && revLatest
        ? (Math.abs(getLatest(capexCore)) / revLatest) * 100
        : null;
    const invPctAssets =
      getLatest(invCore) !== null && assetsLatest
        ? (Math.abs(getLatest(invCore)) / assetsLatest) * 100
        : null;
    const ndE = getLatest(netDebtEbitdaCore);
    const goodwillIntangiblesToAssets =
      assetsLatest && assetsLatest > 0
        ? (((getLatest(goodwillCore) || 0) + (getLatest(intangiblesCore) || 0)) /
            assetsLatest) *
          100
        : null;
    const rdSales =
      getLatest(rdCore) !== null && revLatest
        ? (Math.abs(getLatest(rdCore)) / revLatest) * 100
        : null;
    const sbcSales =
      getLatest(sbcProfileRow) !== null && revLatest
        ? (Math.abs(getLatest(sbcProfileRow)) / revLatest) * 100
        : null;
    const ppeAssets =
      getLatest(ppeCore) !== null && assetsLatest
        ? (Math.abs(getLatest(ppeCore)) / assetsLatest) * 100
        : null;
    const inferred = inferProfile({
      grossMargin: gm,
      capexSales,
      inventoryToAssets: invPctAssets,
      netDebtEbitda: ndE,
      goodwillIntangiblesToAssets,
      rdSales,
      sbcSales,
      ppeAssets,
      sectorHint: options.sector || options.industry || null
    });
    activeProfile = inferred.profile;
    results.profileInference = inferred;
  }

  // ══════════════════════════════════════════════════════════
  // 1. REVENUE & GROWTH ANALYSIS
  // ══════════════════════════════════════════════════════════
  const growthItems = [];

  if (revenueRow) {
    const vals = getRecentValues(revenueRow, 10);
    const cagrWindow = getLatestCagrWindow(revenueRow, 5, 12);
    const gr = cagrWindow?.growth ?? null;
    const years = cagrWindow?.years ?? null;
    const startValue = cagrWindow?.startValue ?? null;
    const endValue = cagrWindow?.endValue ?? null;
    growthItems.push(
      makeItem(
        'Revenue Growth (CAGR)',
        gr !== null && years !== null
          ? `${years}Y CAGR: ${gr.toFixed(1)}%`
          : 'Insufficient data',
        vals,
        gr > 15 ? 'bull' : gr > 8 ? 'neutral' : 'bear',
        gr > 15
          ? 'Strong'
          : gr > 8
            ? 'Moderate'
            : gr > 0
              ? 'Slow'
              : 'Declining',
        startValue !== null && endValue !== null
          ? `Revenue: ${startValue.toFixed(0)} → ${endValue.toFixed(0)}`
          : ''
      )
    );

    // YoY revenue growth consistency
    const yoyGr = yoyGrowth(vals);
    const validYoy = yoyGr.filter((v) => v !== null);
    if (validYoy.length >= 3) {
      const latestYoy = validYoy[validYoy.length - 1];
      const avgYoy = avg(validYoy);
      const sd = stddev(validYoy);
      const consistent = sd !== null && sd < 10;
      growthItems.push(
        makeItem(
          'Revenue YoY Growth',
          `Latest YoY: ${latestYoy?.toFixed(1)}% | Avg: ${avgYoy?.toFixed(1)}%`,
          validYoy,
          latestYoy > 10 ? 'bull' : latestYoy > 3 ? 'neutral' : 'bear',
          consistent ? 'Consistent' : 'Volatile',
          sd !== null
            ? `Std dev: ${sd.toFixed(1)}pp — ${consistent ? 'predictable' : 'erratic'} growth`
            : ''
        )
      );
    }
  }

  const epsRow = findRowAny(
    is,
    'Diluted EPS',
    ['BPA', 'Diluido'],
    'EPS Diluted'
  );
  if (epsRow) {
    const vals = getRecentValues(epsRow, 10);
    const latest = vals[vals.length - 1];
    const first = vals[0];
    const years = vals.length - 1;
    const growth = safeGrowthScore(vals);
    const gr = growth.value;
    growthItems.push(
      makeItem(
        'EPS Growth (Diluted)',
        gr !== null
          ? `${growth.kind === 'cagr' ? `${years}Y CAGR` : 'Median YoY'}: ${gr.toFixed(1)}%`
          : 'N/A',
        vals,
        gr > 15 ? 'bull' : gr > 8 ? 'neutral' : 'bear',
        gr > 15 ? 'Excellent' : gr > 8 ? 'Good' : 'Weak'
      )
    );
  }

  // EPS Basic for comparison
  const epsBasicRow = findRowAny(
    is,
    ['BPA', 'Básico'],
    'Basic EPS',
    'EPS Basic'
  );
  if (epsBasicRow && epsRow) {
    const diluted = getLatest(epsRow);
    const basic = getLatest(epsBasicRow);
    if (diluted && basic && basic !== 0) {
      const dilutionPct = ((basic - diluted) / basic) * 100;
      if (dilutionPct > 3) {
        growthItems.push(
          makeItem(
            'Dilution Impact (Basic vs Diluted EPS)',
            `Basic: ${basic.toFixed(2)} vs Diluted: ${diluted.toFixed(2)} (${dilutionPct.toFixed(1)}% dilution)`,
            [],
            dilutionPct < 3 ? 'bull' : dilutionPct < 8 ? 'neutral' : 'bear',
            dilutionPct < 3
              ? 'Minimal Dilution'
              : dilutionPct < 8
                ? 'Moderate'
                : 'Heavy Dilution'
          )
        );
      }
    }
  }

  const ebitdaRow = findRowAny(is, 'Normalized EBITDA', 'EBITDA');
  if (ebitdaRow) {
    const vals = getRecentValues(ebitdaRow, 10);
    const latest = vals[vals.length - 1];
    const first = vals[0];
    const gr = cagr(first, latest, vals.length - 1);
    growthItems.push(
      makeItem(
        'EBITDA Growth',
        gr !== null ? `CAGR: ${gr.toFixed(1)}%` : 'N/A',
        vals,
        gr > 12 ? 'bull' : gr > 5 ? 'neutral' : 'bear',
        gr > 12 ? 'Strong' : gr > 5 ? 'Moderate' : 'Weak'
      )
    );
  }

  const opIncRow = findRowAny(
    is,
    'Ingresos de explotación',
    'Operating Income'
  );
  if (opIncRow) {
    const vals = getRecentValues(opIncRow, 10);
    const latest = vals[vals.length - 1];
    const first = vals[0];
    const growth = safeGrowthScore(vals);
    const gr = growth.value;
    growthItems.push(
      makeItem(
        'Operating Income Growth',
        gr !== null
          ? `${growth.kind === 'cagr' ? 'CAGR' : 'Median YoY'}: ${gr.toFixed(1)}%`
          : 'N/A',
        vals,
        gr > 12 ? 'bull' : gr > 5 ? 'neutral' : 'bear',
        gr > 12 ? 'Strong' : gr > 5 ? 'Moderate' : 'Weak'
      )
    );
  }

  const netIncRow = findRowAny(is, 'Beneficio neto', 'Net Income');
  if (netIncRow) {
    const vals = getRecentValues(netIncRow, 10);
    const latest = vals[vals.length - 1];
    const first = vals[0];
    const growth = safeGrowthScore(vals);
    const gr = growth.value;
    growthItems.push(
      makeItem(
        'Net Income Growth',
        gr !== null
          ? `${growth.kind === 'cagr' ? 'CAGR' : 'Median YoY'}: ${gr.toFixed(1)}%`
          : 'N/A',
        vals,
        gr > 12 ? 'bull' : gr > 5 ? 'neutral' : 'bear',
        gr > 12 ? 'Strong' : gr > 5 ? 'Moderate' : 'Weak'
      )
    );
  }

  const fcfRow = findRowAny(cf, 'Flujo de caja libre', 'Free Cash Flow');
  if (fcfRow) {
    const vals = getRecentValues(fcfRow, 10);
    const latest = vals[vals.length - 1];
    const first = vals[0];
    const growth = safeGrowthScore(vals);
    const gr = growth.value;
    growthItems.push(
      makeItem(
        'Free Cash Flow Growth',
        gr !== null
          ? `${growth.kind === 'cagr' ? 'CAGR' : 'Median YoY'}: ${gr.toFixed(1)}%`
          : 'N/A',
        vals,
        gr > 12 ? 'bull' : gr > 5 ? 'neutral' : 'bear',
        gr > 12 ? 'Strong' : gr > 5 ? 'Decent' : 'Weak'
      )
    );
  }

  if (growthItems.length) {
    const grade = sectionGrade(growthItems);
    results.scores.growth = grade;
    results.sections.push({
      id: 'growth',
      title: 'Growth',
      icon: '📈',
      grade,
      items: growthItems
    });
  }

  // ══════════════════════════════════════════════════════════
  // 2. PROFITABILITY & MARGINS
  // ══════════════════════════════════════════════════════════
  const marginItems = [];

  const grossRow = findRowAny(
    is,
    ['gross', 'margin'],
    ['margen', 'bruto'],
    'Gross Margin',
    '% Gross'
  );
  const grossRowR = findRowAny(
    ratios,
    'Margen de beneficio bruto',
    'Gross Margin'
  );
  const grossSrc = grossRow || grossRowR;
  if (grossSrc) {
    const vals = getRecentValues(grossSrc, 10);
    const latest = vals[vals.length - 1];
    const trend = getTrend(vals);
    const sd = stddev(vals);
    marginItems.push(
      makeItem(
        'Gross Margin',
        `Latest: ${latest?.toFixed(1)}% — Trend: ${trend}`,
        vals,
        latest > mt('gross_margin', 'bull')
          ? 'bull'
          : latest > mt('gross_margin', 'neutral')
            ? 'neutral'
            : 'bear',
        latest > mt('gross_margin', 'bull') + 10
          ? 'Wide Moat'
          : latest > mt('gross_margin', 'bull')
            ? 'Strong'
            : latest > mt('gross_margin', 'neutral')
              ? 'Decent'
              : 'Thin',
        sd !== null
          ? `Stability: σ=${sd.toFixed(1)}pp (${sd < 3 ? 'very stable' : sd < 6 ? 'stable' : 'volatile'})`
          : ''
      )
    );
  }

  const opRow = findRowAny(
    is,
    ['operating', 'margin'],
    ['margen', 'operativo'],
    'Operating Margin',
    '% Operating'
  );
  const opRowR = findRowAny(ratios, 'Margen EBIT', 'Operating Margin');
  const opSrc = opRow || opRowR;
  if (opSrc) {
    const vals = getRecentValues(opSrc, 10);
    const latest = vals[vals.length - 1];
    const trend = getTrend(vals);
    marginItems.push(
      makeItem(
        'Operating Margin (EBIT)',
        `Latest: ${latest?.toFixed(1)}% — Trend: ${trend}`,
        vals,
        latest > 20 ? 'bull' : latest > 10 ? 'neutral' : 'bear',
        latest > 25
          ? 'Best-in-class'
          : latest > 20
            ? 'Excellent'
            : latest > 10
              ? 'Healthy'
              : 'Compressed'
      )
    );
  }

  const ebitdaMarginRow = findRowAny(ratios, 'Margen EBITDA', 'EBITDA Margin');
  if (ebitdaMarginRow) {
    const vals = getRecentValues(ebitdaMarginRow, 10);
    const latest = vals[vals.length - 1];
    marginItems.push(
      makeItem(
        'EBITDA Margin',
        `Latest: ${latest?.toFixed(1)}%`,
        vals,
        latest > 25 ? 'bull' : latest > 15 ? 'neutral' : 'bear',
        latest > 30
          ? 'Elite'
          : latest > 25
            ? 'Strong'
            : latest > 15
              ? 'Fair'
              : 'Low'
      )
    );
  }

  const netMRow = findRowAny(is, 'márgenes de beneficio neto');
  const netMRowR = findRowAny(ratios, 'Margen neto', 'Net Margin');
  const netMSrc = netMRow || netMRowR;
  if (netMSrc) {
    const vals = getRecentValues(netMSrc, 10);
    const latest = vals[vals.length - 1];
    marginItems.push(
      makeItem(
        'Net Profit Margin',
        `Latest: ${latest?.toFixed(1)}%`,
        vals,
        latest > 15 ? 'bull' : latest > 8 ? 'neutral' : 'bear',
        latest > 20
          ? 'Exceptional'
          : latest > 15
            ? 'High Quality'
            : latest > 8
              ? 'OK'
              : 'Low'
      )
    );
  }

  const fcfMarginRow = findRowAny(cf, 'Free Cash Flow Margin');
  const fcfMarginRowR = findRowAny(
    ratios,
    'Free Cash Flow Margin',
    'FCF Margin'
  );
  const fcfMSrc = fcfMarginRow || fcfMarginRowR;
  if (fcfMSrc) {
    const vals = getRecentValues(fcfMSrc, 10);
    const latest = vals[vals.length - 1];
    marginItems.push(
      makeItem(
        'FCF Margin',
        `Latest: ${latest?.toFixed(1)}%`,
        vals,
        latest > 20 ? 'bull' : latest > 10 ? 'neutral' : 'bear',
        latest > 25
          ? 'Cash Machine'
          : latest > 20
            ? 'Excellent'
            : latest > 10
              ? 'Solid'
              : 'Weak'
      )
    );
  }

  // Margin expansion check: operating margin expanding vs gross?
  if (grossSrc && opSrc) {
    const grossVals = getRecentValues(grossSrc, 6);
    const opVals = getRecentValues(opSrc, 6);
    if (grossVals.length >= 3 && opVals.length >= 3) {
      const grossDelta = grossVals[grossVals.length - 1] - grossVals[0];
      const opDelta = opVals[opVals.length - 1] - opVals[0];
      const expanding = opDelta > 0 && opDelta >= grossDelta;
      marginItems.push(
        makeItem(
          'Operating Leverage',
          `Gross Δ: ${grossDelta > 0 ? '+' : ''}${grossDelta.toFixed(1)}pp | Op Δ: ${opDelta > 0 ? '+' : ''}${opDelta.toFixed(1)}pp`,
          opVals,
          expanding ? 'bull' : opDelta > 0 ? 'neutral' : 'bear',
          expanding
            ? 'Positive Leverage'
            : opDelta > 0
              ? 'Some Leverage'
              : 'Margin Compression',
          expanding
            ? 'Operating margins expanding faster than gross → scaling well'
            : 'Watch for cost structure issues'
        )
      );
    }
  }

  if (marginItems.length) {
    const grade = sectionGrade(marginItems);
    results.scores.margins = grade;
    results.sections.push({
      id: 'margins',
      title: 'Profitability & Margins',
      icon: '💰',
      grade,
      items: marginItems
    });
  }

  // ══════════════════════════════════════════════════════════
  // 3. COST STRUCTURE & OPEX ANALYSIS
  // ══════════════════════════════════════════════════════════
  const costItems = [];

  // COGS analysis
  const cogsRow = findRowAny(
    is,
    'Coste de los ingresos',
    'Cost of Goods Sold',
    'COGS'
  );
  if (cogsRow && revenueRow) {
    const pairs = alignByDate(cogsRow, revenueRow, 6);
    if (pairs.length >= 2) {
      const latestPct =
        (Math.abs(pairs[pairs.length - 1].a) /
          Math.abs(pairs[pairs.length - 1].b)) *
        100;
      const firstPct = (Math.abs(pairs[0].a) / Math.abs(pairs[0].b)) * 100;
      const delta = latestPct - firstPct;
      costItems.push(
        makeItem(
          'COGS as % of Revenue',
          `Latest: ${latestPct.toFixed(1)}% (Δ ${delta > 0 ? '+' : ''}${delta.toFixed(1)}pp)`,
          pairs.map((p) => p.a),
          delta < -2 ? 'bull' : delta < 2 ? 'neutral' : 'bear',
          delta < -2 ? 'Improving' : delta < 2 ? 'Stable' : 'Rising Costs'
        )
      );
    }
  }

  // Operating Expenses as % of Gross Profit (golden rule)
  const opExRow =
    findRowExact(is, 'Total Operating Expenses', 'Gastos operativos totales') ||
    findRowAny(is, ['total', 'operating', 'expenses'], 'Gastos operativos');
  const opIncomeGolden = opIncomeRowCore;
  if ((grossProfitRow && opIncomeGolden) || (opExRow && grossProfitRow)) {
    const gp = getLatest(grossProfitRow);
    const opEx = opExRow
      ? Math.abs(getLatest(opExRow) || 0)
      : gp !== null && getLatest(opIncomeGolden) !== null
        ? Math.abs(gp - getLatest(opIncomeGolden))
        : null;
    if (gp > 0 && opEx !== null) {
      const ratio = (opEx / gp) * 100;
      costItems.push(
        makeItem(
          'Operating Expenses as % of Gross Profit',
          `OpEx/Gross Profit: ${ratio.toFixed(1)}%`,
          [ratio],
          ratio <= mt('opex_gp', 'bull')
            ? 'bull'
            : ratio <= mt('opex_gp', 'neutral')
              ? 'neutral'
              : 'bear',
          ratio <= mt('opex_gp', 'bull')
            ? 'Controlled'
            : ratio <= mt('opex_gp', 'neutral')
              ? 'Watchlist'
              : 'Gross profit consumed',
          'Golden rule: OpEx should not eat most gross profit (gastos operativos controlados).'
        )
      );
    }
  }

  // SG&A analysis
  const sgaRow = findRowAny(is, 'Gastos de venta', 'SG&A', [
    'selling',
    'general',
    'admin'
  ]);
  if (sgaRow && revenueRow) {
    const pairs = alignByDate(sgaRow, revenueRow, 6);
    if (pairs.length >= 2) {
      const latestPct =
        (Math.abs(pairs[pairs.length - 1].a) / pairs[pairs.length - 1].b) * 100;
      const firstPct = (Math.abs(pairs[0].a) / pairs[0].b) * 100;
      const delta = latestPct - firstPct;
      costItems.push(
        makeItem(
          'SG&A as % of Revenue',
          `Latest: ${latestPct.toFixed(1)}% (Δ ${delta > 0 ? '+' : ''}${delta.toFixed(1)}pp)`,
          pairs.map((p) => Math.abs(p.a)),
          delta < -1 ? 'bull' : latestPct < 25 ? 'neutral' : 'bear',
          delta < -1
            ? 'Improving Efficiency'
            : latestPct < 25
              ? 'Controlled'
              : 'High Overhead',
          'Lower is better — shows operational efficiency'
        )
      );
    }
  }

  // R&D analysis
  const rdRow = findRowAny(
    is,
    'Gastos de investigación',
    'Research and Development',
    'R&D',
    ['r&d', 'expense']
  );
  if (rdRow && revenueRow) {
    const pairs = alignByDate(rdRow, revenueRow, 6);
    if (pairs.length >= 2) {
      const latestPct =
        (Math.abs(pairs[pairs.length - 1].a) / pairs[pairs.length - 1].b) * 100;
      costItems.push(
        makeItem(
          'R&D as % of Revenue',
          `Latest: ${latestPct.toFixed(1)}%`,
          pairs.map((p) => Math.abs(p.a)),
          latestPct > 5 ? 'bull' : latestPct > 2 ? 'neutral' : 'neutral',
          latestPct > 15
            ? 'Heavy Investment'
            : latestPct > 5
              ? 'Investing in Innovation'
              : 'Low R&D',
          'R&D investment sustains long-term competitive advantages'
        )
      );
    }
  }

  // D&A analysis
  const daRow = findRowAny(
    is,
    'Depreciación y amortización',
    'Depreciation',
    'D&A'
  );
  if (daRow && revenueRow) {
    const pairs = alignByDate(daRow, revenueRow, 6);
    if (pairs.length >= 2) {
      const latestPct =
        (Math.abs(pairs[pairs.length - 1].a) / pairs[pairs.length - 1].b) * 100;
      costItems.push(
        makeItem(
          'D&A as % of Revenue',
          `Latest: ${latestPct.toFixed(1)}%`,
          pairs.map((p) => Math.abs(p.a)),
          latestPct < 5 ? 'bull' : latestPct < 10 ? 'neutral' : 'bear',
          latestPct < 5
            ? 'Asset-light'
            : latestPct < 10
              ? 'Moderate'
              : 'Capital Intensive',
          'High D&A = heavy fixed assets or acquisitions with amortization'
        )
      );
    }
  }

  // Effective Tax Rate
  const taxRateRow = findRowAny(
    is,
    'Tasa impositiva efectiva',
    'Effective Tax Rate'
  );
  if (taxRateRow) {
    const vals = getRecentValues(taxRateRow, 6);
    const latest = vals[vals.length - 1];
    const sd = stddev(vals);
    if (latest !== null) {
      costItems.push(
        makeItem(
          'Effective Tax Rate',
          `Latest: ${latest.toFixed(1)}%`,
          vals,
          latest > 10 && latest < 28
            ? 'bull'
            : latest < 10
              ? 'neutral'
              : 'bear',
          latest < 10
            ? 'Unusually Low (check sustainability)'
            : latest < 22
              ? 'Tax Efficient'
              : latest < 28
                ? 'Normal'
                : 'High Tax Burden',
          sd !== null
            ? `Consistency: σ=${sd.toFixed(1)}pp — ${sd < 3 ? 'stable' : 'volatile tax rate'}`
            : ''
        )
      );
    }
  }

  // Interest Expense analysis
  const intExpRow = findRowAny(is, 'Gastos por intereses', 'Interest Expense');
  if (intExpRow && revenueRow) {
    const pairs = alignByDate(intExpRow, revenueRow, 6);
    if (pairs.length >= 1) {
      const latestPct =
        (Math.abs(pairs[pairs.length - 1].a) / pairs[pairs.length - 1].b) * 100;
      if (latestPct > 0.5) {
        costItems.push(
          makeItem(
            'Interest Expense as % of Revenue',
            `Latest: ${latestPct.toFixed(1)}%`,
            pairs.map((p) => Math.abs(p.a)),
            latestPct < 2 ? 'bull' : latestPct < 5 ? 'neutral' : 'bear',
            latestPct < 2
              ? 'Minimal'
              : latestPct < 5
                ? 'Manageable'
                : 'Heavy Interest Burden'
          )
        );
      }
    }
  }

  // Stock-Based Compensation
  const sbcRow = findRowAny(
    cf,
    'Compensación basada en acciones',
    'Stock-Based Compensation',
    'Stock Based Comp'
  );
  if (sbcRow && revenueRow) {
    const pairs = alignByDate(sbcRow, revenueRow, 6);
    if (pairs.length >= 1) {
      const latestPct =
        (Math.abs(pairs[pairs.length - 1].a) / pairs[pairs.length - 1].b) * 100;
      costItems.push(
        makeItem(
          'Stock-Based Comp as % of Revenue',
          `Latest: ${latestPct.toFixed(1)}%`,
          pairs.map((p) => Math.abs(p.a)),
          latestPct < 3 ? 'bull' : latestPct < 8 ? 'neutral' : 'bear',
          latestPct < 3
            ? 'Low Dilution'
            : latestPct < 8
              ? 'Moderate SBC'
              : 'Heavy SBC Dilution',
          'High SBC overstates GAAP earnings vs true cash cost'
        )
      );
    }
  }

  if (costItems.length) {
    const grade = sectionGrade(costItems);
    results.scores.costs = grade;
    results.sections.push({
      id: 'costs',
      title: 'Cost Structure & OpEx',
      icon: '🏗️',
      grade,
      items: costItems
    });
  }

  // ══════════════════════════════════════════════════════════
  // 4. RETURNS & ECONOMIC MOAT
  // ══════════════════════════════════════════════════════════
  const moatItems = [];

  const roicRow = findRowAny(
    ratios,
    'Return on Invested Capital',
    'Normalized ROIC',
    'ROIC'
  );
  if (roicRow) {
    const vals = getRecentValues(roicRow, 10);
    const latest = vals[vals.length - 1];
    const trend = getTrend(vals);
    const avgVal = avg(vals);
    moatItems.push(
      makeItem(
        'ROIC (Return on Invested Capital)',
        `Latest: ${latest?.toFixed(1)}% | Avg: ${avgVal?.toFixed(1)}% — Trend: ${trend}`,
        vals,
        latest > mt('roic', 'bull')
          ? 'bull'
          : latest > mt('roic', 'neutral')
            ? 'neutral'
            : 'bear',
        latest > mt('roic', 'bull') + 5
          ? 'Exceptional Moat'
          : latest > mt('roic', 'bull')
            ? 'Wide Moat'
            : latest > mt('roic', 'neutral')
              ? 'Narrow Moat'
              : 'No Moat',
        'ROIC > WACC (~8-10%) = value creation. Consistency matters more than level'
      )
    );
  }

  const roeRow = findRowAny(
    ratios,
    'Rentabilidad sobre recursos propios',
    'recursos propios',
    'ROE',
    'Return on Equity'
  );
  const bsAssetsForMultiplier = findRowAny(bs, 'Total Assets', 'Activo total', 'Activos totales');
  const bsEquityForMultiplier = findRowAny(
    bs,
    'Total Equity',
    'Total Common Equity',
    'Fondos propios totales',
    'Patrimonio neto común total'
  );

  if (roeRow) {
    const vals = getRecentValues(roeRow, 10);
    const latest = vals[vals.length - 1];
    const roaRowForRoe = findRowAny(
      ratios,
      'Rentabilidad sobre activos',
      'ROA',
      'Return on Assets'
    );
    const roaForRoe = getLatest(roaRowForRoe);
    const equityMultiplierForRoe = computeEquityMultiplierFromBalance(
      bsAssetsForMultiplier,
      bsEquityForMultiplier,
      2
    );
    const leverageInflatedRoe =
      equityMultiplierForRoe !== null && equityMultiplierForRoe > 4;
    moatItems.push(
      makeItem(
        'ROE (Return on Equity)',
        `Latest: ${latest?.toFixed(1)}%`,
        vals,
        leverageInflatedRoe
          ? 'neutral'
          : latest > 20
            ? 'bull'
            : latest > 12
              ? 'neutral'
              : 'bear',
        leverageInflatedRoe
          ? 'High ROE but leverage-inflated'
          : latest > 25
            ? 'Outstanding'
            : latest > 20
              ? 'Excellent'
              : latest > 12
                ? 'Good'
                : 'Below Average',
        leverageInflatedRoe
          ? 'ROE appears high, but equity multiplier suggests leverage-driven inflation. Validate with ROA/ROIC.'
          : 'Beware: high leverage can inflate ROE artificially'
      )
    );
  }

  const roaRow = findRowAny(
    ratios,
    'Rentabilidad sobre activos',
    'ROA',
    'Return on Assets'
  );
  if (roaRow) {
    const vals = getRecentValues(roaRow, 10);
    const latest = vals[vals.length - 1];
    moatItems.push(
      makeItem(
        'ROA (Return on Assets)',
        `Latest: ${latest?.toFixed(1)}%`,
        vals,
        latest > 10 ? 'bull' : latest > 5 ? 'neutral' : 'bear',
        latest > 15
          ? 'Asset-light Star'
          : latest > 10
            ? 'Efficient'
            : latest > 5
              ? 'OK'
              : 'Capital Heavy'
      )
    );
  }

  // Dupont decomposition insight: ROE driven by margins vs leverage
  if (roeRow && roaRow) {
    const equityMultiplier = computeEquityMultiplierFromBalance(
      bsAssetsForMultiplier,
      bsEquityForMultiplier,
      2
    );
    if (equityMultiplier !== null) {
      moatItems.push(
        makeItem(
          'Equity Multiplier (Assets/Equity)',
          `${equityMultiplier.toFixed(1)}x — ${equityMultiplier < 2 ? 'Low leverage' : equityMultiplier < 3 ? 'Moderate leverage' : 'High leverage'}`,
          [],
          equityMultiplier < 2
            ? 'bull'
            : equityMultiplier < 3
              ? 'neutral'
              : 'bear',
          equityMultiplier < 2
            ? 'Quality ROE'
            : equityMultiplier < 3
              ? 'Some Leverage'
              : 'Leverage-driven ROE',
          'Computed from balance sheet averages (Assets/Equity). Lower multiplier = ROE driven by profitability, not debt'
        )
      );
    }
  }

  const fcfNetRow = findRowAny(ratios, 'Free / Net Income', 'FCF / Net Income');
  if (fcfNetRow) {
    const vals = getRecentValues(fcfNetRow, 8);
    const latest = vals[vals.length - 1];
    if (latest !== null && latest < 0) {
      moatItems.push(
        makeItem(
          'FCF / Net Income (Earnings Quality)',
          'Not meaningful: Net Income ≤ 0 in recent period(s)',
          vals,
          'neutral',
          'Not meaningful',
          'When NI is negative, conversion ratios can invert; use CFO/FCF margin context instead'
        )
      );
    } else {
      moatItems.push(
        makeItem(
          'FCF / Net Income (Earnings Quality)',
          `Latest: ${latest?.toFixed(0)}%`,
          vals,
          latest > 100 ? 'bull' : latest > 70 ? 'neutral' : 'bear',
          latest > 120
            ? 'Super Cash Generative'
            : latest > 100
              ? 'Quality Earnings'
              : latest > 70
                ? 'Decent'
                : 'Accrual Heavy',
          'FCF > Net Income = real cash earnings; <70% = beware accounting tricks'
        )
      );
    }
  }

  const capexSalesRow = findRowAny(ratios, 'Capex / Sales', 'Capex/Sales');
  if (capexSalesRow) {
    const vals = getRecentValues(capexSalesRow, 8);
    const latest = vals[vals.length - 1];
    moatItems.push(
      makeItem(
        'Capex / Sales (Maintenance Need)',
        `Latest: ${latest?.toFixed(1)}%`,
        vals,
        latest < 5 ? 'bull' : latest < 10 ? 'neutral' : 'bear',
        latest < 3
          ? 'Ultra Asset-light'
          : latest < 5
            ? 'Asset-light'
            : latest < 10
              ? 'Moderate'
              : 'Capital Intensive'
      )
    );
  }

  if (moatItems.length) {
    const grade = sectionGrade(moatItems);
    results.scores.moat = grade;
    results.sections.push({
      id: 'moat',
      title: 'Returns & Economic Moat',
      icon: '🏰',
      grade,
      items: moatItems
    });
  }

  // ══════════════════════════════════════════════════════════
  // 5. BALANCE SHEET HEALTH
  // ══════════════════════════════════════════════════════════
  const bsItems = [];

  // Current Assets composition
  const cashRow = findRowAny(
    bs,
    'Efectivo y equivalentes',
    'Cash and Cash Equivalents',
    'Cash & Equivalents'
  );
  const stInvRow = findRowAny(
    bs,
    'Inversiones a corto plazo',
    'Short-Term Investments'
  );
  const arRow = findRowAny(
    bs,
    'Cuentas por cobrar',
    'Accounts Receivable',
    'Trade Receivables'
  );
  const invRow = findRowAny(bs, 'Inventarios', 'Inventory', 'Inventories');
  const totalCARow = findRowAny(
    bs,
    'Total activos corrientes',
    'Total Current Assets'
  );
  const totalAssetsRow = findRowAny(bs, 'Activos totales', 'Total Assets');

  if (cashRow && totalAssetsRow) {
    const pairs = alignByDate(cashRow, totalAssetsRow, 6);
    if (pairs.length >= 1) {
      const cashPct = (pairs[pairs.length - 1].a / pairs[pairs.length - 1].b) * 100;
      bsItems.push(
        makeItem(
          'Cash & Equivalents / Total Assets',
          `Latest: ${cashPct.toFixed(1)}% ($${pairs[pairs.length - 1].a.toFixed(0)}M)`,
          pairs.map((p) => p.a),
          cashPct > 15 ? 'bull' : cashPct > 5 ? 'neutral' : 'bear',
          cashPct > 20
            ? 'Cash Rich'
            : cashPct > 15
              ? 'Healthy Buffer'
              : cashPct > 5
                ? 'Adequate'
                : 'Cash Light'
        )
      );
    }
  }

  if (arRow && revenueRow) {
    const pairs = alignByDate(arRow, revenueRow, 6);
    if (pairs.length >= 2) {
      const arDays = (pairs[pairs.length - 1].a / pairs[pairs.length - 1].b) * 365;
      const trend = getTrend(pairs.map((p) => (p.b ? (p.a / p.b) * 365 : null)));
      bsItems.push(
        makeItem(
          'Accounts Receivable (Days)',
          `~${arDays.toFixed(0)} days — Trend: ${trend}`,
          pairs.map((p) => p.a),
          trend === 'up'
            ? arDays < 45
              ? 'neutral'
              : 'bear'
            : arDays < 45
              ? 'bull'
              : arDays < 75
                ? 'neutral'
                : 'bear',
          trend === 'up'
            ? arDays < 45
              ? 'Rising collection days (watch)'
              : 'Collections weakening'
            : arDays < 30
              ? 'Quick Collection'
              : arDays < 45
                ? 'Healthy'
                : arDays < 75
                  ? 'Normal'
                  : 'Slow Collection'
        )
      );
    }
  }

  if (invRow && revenueRow) {
    const invVals = getRecentValues(invRow, 6);
    const revVals = getRecentValues(revenueRow, 6);
    if (invVals.length >= 1 && revVals.length >= 1) {
      const latestInv = invVals[invVals.length - 1];
      const cogsLatest = cogsRow ? getLatest(cogsRow) : null;
      if (latestInv > 0) {
        const daysRef = cogsLatest ? cogsLatest : revVals[revVals.length - 1];
        const invDays = (latestInv / Math.abs(daysRef)) * 365;
        bsItems.push(
          makeItem(
            'Inventory (Days on Hand)',
            `~${invDays.toFixed(0)} days | $${latestInv.toFixed(0)}M`,
            invVals,
            invDays < 45 ? 'bull' : invDays < 90 ? 'neutral' : 'bear',
            invDays < 30
              ? 'Lean'
              : invDays < 45
                ? 'Efficient'
                : invDays < 90
                  ? 'Normal'
                  : 'Heavy Inventory'
          )
        );
      }
    }
  }

  // Goodwill & Intangibles as % of Total Assets
  const gwRow = findRowAny(bs, 'Fondo de comercio', 'Goodwill');
  const intangRow = findRowAny(
    bs,
    'Activos intangibles',
    'Intangible Assets',
    'Intangibles'
  );
  if ((gwRow || intangRow) && totalAssetsRow) {
    const gw = gwRow ? getLatest(gwRow) : 0;
    const intang = intangRow ? getLatest(intangRow) : 0;
    const ta = getLatest(totalAssetsRow);
    if (ta && ta > 0) {
      const total = (gw || 0) + (intang || 0);
      const pct = (total / ta) * 100;
      bsItems.push(
        makeItem(
          'Goodwill + Intangibles / Total Assets',
          `${pct.toFixed(1)}% ($${total.toFixed(0)}M of $${ta.toFixed(0)}M)`,
          [],
          pct < 15 ? 'bull' : pct < 35 ? 'neutral' : 'bear',
          pct < 10
            ? 'Low acquisition-intangibles concentration'
            : pct < 15
              ? 'Low'
              : pct < 35
                ? 'Acquisition-driven'
                : 'Impairment Risk',
          'High goodwill = acquisition risk. Watch for impairment charges'
        )
      );
    }
  }

  // PP&E
  const ppeRow = findRowAny(
    bs,
    'Propiedad, planta y equipo',
    'Property, Plant',
    'PP&E',
    'Net PP&E'
  );
  if (ppeRow && totalAssetsRow) {
    const ppe = getLatest(ppeRow);
    const ta = getLatest(totalAssetsRow);
    if (ppe && ta && ta > 0) {
      const pct = (ppe / ta) * 100;
      bsItems.push(
        makeItem(
          'PP&E / Total Assets',
          `${pct.toFixed(1)}%`,
          getRecentValues(ppeRow, 6),
          pct < 20 ? 'bull' : pct < 40 ? 'neutral' : 'bear',
          pct < 15
            ? 'Asset-light'
            : pct < 20
              ? 'Low'
              : pct < 40
                ? 'Moderate'
                : 'Asset Heavy'
        )
      );
    }
  }

  // Retained Earnings trend
  const retEarnRow = findRowAny(
    bs,
    'Beneficios retenidos',
    'Retained Earnings'
  );
  if (retEarnRow) {
    const vals = getRecentValues(retEarnRow, 8);
    const trend = getTrend(vals);
    const latest = vals[vals.length - 1];
    bsItems.push(
      makeItem(
        'Retained Earnings',
        `Latest: $${latest?.toFixed(0)}M — Trend: ${trend}`,
        vals,
        trend === 'up' && latest > 0 ? 'bull' : latest > 0 ? 'neutral' : 'neutral',
        latest < 0
          ? 'Needs context (capital returns vs losses)'
          : trend === 'up'
            ? 'Growing'
            : 'Flat/Declining',
        latest < 0
          ? 'Negative retained earnings may reflect cumulative buybacks/dividends, not necessarily historical unprofitability. Confirm with NI history, buybacks, dividends, and equity trend.'
          : ''
      )
    );
  }

  // Total Equity trend
  const totalEquityRow = findRowAny(
    bs,
    'Total fondos propios',
    'Total Equity',
    'Patrimonio neto total'
  );
  if (totalEquityRow) {
    const vals = getRecentValues(totalEquityRow, 8);
    const trend = getTrend(vals);
    const latest = vals[vals.length - 1];
    bsItems.push(
      makeItem(
        'Total Equity',
        `Latest: $${latest?.toFixed(0)}M — Trend: ${trend}`,
        vals,
        latest > 0 && trend === 'up' ? 'bull' : latest > 0 ? 'neutral' : 'bear',
        latest < 0
          ? 'Negative Equity ⚠️'
          : trend === 'up'
            ? 'Growing Book Value'
            : 'Stable'
      )
    );
  }

  if (bsItems.length) {
    const grade = sectionGrade(bsItems);
    results.scores.balance = grade;
    results.sections.push({
      id: 'balance-composition',
      title: 'Balance Sheet Composition',
      icon: '📊',
      grade,
      items: bsItems
    });
  }

  // ══════════════════════════════════════════════════════════
  // 6. DEBT & FINANCIAL HEALTH
  // ══════════════════════════════════════════════════════════
  const debtItems = [];

  const debtEquityRow = findRowAny(
    ratios,
    'Deuda total / Fondos propios',
    'Deuda total / capital total',
    'Pasivo total / Activo total',
    'Total Debt/Equity',
    'Debt to Equity'
  );
  if (debtEquityRow) {
    const vals = getRecentValues(debtEquityRow, 8);
    const latest = vals[vals.length - 1];
    debtItems.push(
      makeItem(
        'Debt / Equity',
        `Latest: ${latest?.toFixed(1)}%`,
        vals,
        latest < 30 ? 'bull' : latest < 80 ? 'neutral' : 'bear',
        latest < 20
          ? 'Near Debt-free'
          : latest < 30
            ? 'Conservative'
            : latest < 80
              ? 'Moderate'
              : 'Leveraged'
      )
    );
  }

  const debtCapitalRow = findRowAny(
    ratios,
    'Deuda total / Capital total',
    'Total Debt / Capital'
  );
  if (debtCapitalRow) {
    const vals = getRecentValues(debtCapitalRow, 8);
    const latest = vals[vals.length - 1];
    debtItems.push(
      makeItem(
        'Total Debt / Capital',
        `Latest: ${latest?.toFixed(1)}%`,
        vals,
        latest < 35 ? 'bull' : latest < 55 ? 'neutral' : 'bear',
        latest < 35 ? 'Conservative' : latest < 55 ? 'Moderate' : 'Leveraged'
      )
    );
  }

  const liabilitiesAssetsRow = findRowAny(
    ratios,
    'Pasivo total / Activo total',
    'Total Liabilities / Total Assets'
  );
  if (liabilitiesAssetsRow) {
    const vals = getRecentValues(liabilitiesAssetsRow, 8);
    const latest = vals[vals.length - 1];
    debtItems.push(
      makeItem(
        'Total Liabilities / Total Assets',
        `Latest: ${latest?.toFixed(1)}%`,
        vals,
        latest < 55 ? 'bull' : latest < 70 ? 'neutral' : 'bear',
        latest < 55 ? 'Asset-backed' : latest < 70 ? 'Balanced' : 'Liability Heavy'
      )
    );
  }

  const ndERow2 = findRowAny(ratios, 'Net Debt / EBITDA', 'Deuda Neta / EBITDA');
  const netDebtEbitdaRow = findRowAny(ce, 'Deuda Neta / EBITDA');
  const ndeSrc = ndERow2 || netDebtEbitdaRow;
  if (ndeSrc) {
    const vals = getRecentValues(ndeSrc, 6);
    const latest = vals[vals.length - 1];
    debtItems.push(
      makeItem(
        'Net Debt / EBITDA',
        `Latest: ${latest?.toFixed(1)}x`,
        vals,
        latest < 0 ? 'bull' : latest < 2 ? 'neutral' : 'bear',
        latest < 0
          ? 'Net Cash Position'
          : latest < 1
            ? 'Very Low Debt'
            : latest < 2
              ? 'Safe'
              : latest < 3
                ? 'Moderate'
                : 'Highly Leveraged',
        'Private equity stress threshold is typically 4-5x'
      )
    );
  }

  // Long-term debt
  const ltDebtRow = findRowAny(
    bs,
    'Deuda a largo plazo',
    'Long-Term Debt',
    'Long Term Debt'
  );
  const stDebtRow = findRowAny(
    bs,
    'Deuda a corto plazo',
    'Short-Term Debt',
    'Short Term Borrowings'
  );
  if (ltDebtRow) {
    const ltVals = getRecentValues(ltDebtRow, 6);
    const trend = getTrend(ltVals);
    const latest = ltVals[ltVals.length - 1];
    debtItems.push(
      makeItem(
        'Long-Term Debt',
        `Latest: $${latest?.toFixed(0)}M — Trend: ${trend}`,
        ltVals,
        trend === 'down' ? 'bull' : trend === 'stable' ? 'neutral' : 'bear',
        trend === 'down'
          ? 'Deleveraging'
          : trend === 'stable'
            ? 'Stable'
            : 'Increasing Debt'
      )
    );
  }

  const currentRatioRow = findRowAny(
    ratios,
    'Ratio de liquidez',
    'Current Ratio'
  );
  if (currentRatioRow) {
    const vals = getRecentValues(currentRatioRow, 6);
    const latest = vals[vals.length - 1];
    const cccContextRow = findRowAny(ratios, 'Cash Conversion Cycle', 'Ciclo de conversión');
    const cccLatest = getLatest(cccContextRow);
    const cfoLiquidityRow = findRowAny(cf, 'Flujo de caja de las operaciones', 'Operating Cash Flow', 'Cash From Operations');
    const cfoValsForLiquidity = getRecentValues(cfoLiquidityRow, 4);
    const cfoPositiveShare = cfoValsForLiquidity.length
      ? cfoValsForLiquidity.filter((v) => v > 0).length / cfoValsForLiquidity.length
      : 0;
    const floatModel = latest <= 1 && cccLatest !== null && cccLatest < 0 && cfoPositiveShare >= 0.75;
    debtItems.push(
      makeItem(
        'Current Ratio',
        `Latest: ${latest?.toFixed(2)}x`,
        vals,
        floatModel
          ? 'neutral'
          : latest > 1.5
            ? 'bull'
            : latest > 1.0
              ? 'neutral'
              : 'bear',
        floatModel
          ? 'Low ratio but float model supported'
          : latest > 2.0
            ? 'Very Healthy'
            : latest > 1.5
              ? 'Healthy'
              : latest > 1.0
                ? 'Adequate'
                : 'Tight Liquidity ⚠️',
        floatModel
          ? 'In negative-CCC models with strong CFO, sub-1 current ratio can be structural; still monitor maturities and stress scenarios.'
          : '',
        {
          scoreRule:
            "latest > 1.5 ? 'bull' : latest > 1.0 ? 'neutral' : 'bear'; latest > 2.0 ? 'Very Healthy' : latest > 1.5 ? 'Healthy' : latest > 1.0 ? 'Adequate' : 'Tight Liquidity ⚠️'."
        }
      )
    );
  }

  // Quick Ratio
  const quickRatioRow = findRowAny(
    ratios,
    'Quick Ratio',
    'Ratio rápido',
    'Acid Test'
  );
  if (quickRatioRow) {
    const vals = getRecentValues(quickRatioRow, 6);
    const latest = vals[vals.length - 1];
    const cccContextRow = findRowAny(ratios, 'Cash Conversion Cycle', 'Ciclo de conversión');
    const cccLatest = getLatest(cccContextRow);
    const cfoLiquidityRow = findRowAny(cf, 'Flujo de caja de las operaciones', 'Operating Cash Flow', 'Cash From Operations');
    const cfoValsForLiquidity = getRecentValues(cfoLiquidityRow, 4);
    const cfoPositiveShare = cfoValsForLiquidity.length
      ? cfoValsForLiquidity.filter((v) => v > 0).length / cfoValsForLiquidity.length
      : 0;
    const floatModel = latest <= 0.8 && cccLatest !== null && cccLatest < 0 && cfoPositiveShare >= 0.75;
    debtItems.push(
      makeItem(
        'Quick Ratio (Acid Test)',
        `Latest: ${latest?.toFixed(2)}x`,
        vals,
        floatModel
          ? 'neutral'
          : latest > 1.2
            ? 'bull'
            : latest > 0.8
              ? 'neutral'
              : 'bear',
        floatModel
          ? 'Low quick ratio but float model supported'
          : latest > 1.5
            ? 'Very Liquid'
            : latest > 1.2
              ? 'Healthy'
              : latest > 0.8
                ? 'OK'
                : 'Low Liquidity ⚠️',
        floatModel
          ? 'With negative CCC and strong CFO, low quick ratio can be structural; monitor funding access and near-term maturities.'
          : 'Excludes inventory — more conservative than current ratio',
        {
          scoreRule:
            "latest > 1.2 ? 'bull' : latest > 0.8 ? 'neutral' : 'bear'; latest > 1.5 ? 'Very Liquid' : latest > 1.2 ? 'Healthy' : latest > 0.8 ? 'OK' : 'Low Liquidity ⚠️'; Excludes inventory."
        }
      )
    );
  }

  const ebitInterestCovRow = findRowAny(
    ratios,
    ['EBIT', 'Interest Expense'],
    ['EBIT', 'Interest']
  );
  const ffoInterestCovRow = findRowAny(ratios, ['FFO', 'Interest Coverage']);
  const ebitdaInterestCovRow = findRowAny(
    ratios,
    ['EBITDA', 'Interest Expense'],
    ['EBITDA', 'Interest']
  );
  const interestCovRow =
    ebitInterestCovRow || ffoInterestCovRow || ebitdaInterestCovRow;
  if (interestCovRow) {
    const vals = getRecentValues(interestCovRow, 6);
    const latest = vals[vals.length - 1];
    if (latest !== null) {
      const coverageLabel =
        interestCovRow === ebitInterestCovRow
          ? 'Interest Coverage (EBIT / Interest)'
          : interestCovRow === ffoInterestCovRow
            ? 'Interest Coverage (FFO / Interest)'
            : 'Interest Coverage (EBITDA / Interest)';
      debtItems.push(
        makeItem(
          coverageLabel,
          `Latest: ${latest?.toFixed(1)}x`,
          vals,
          latest > 8 ? 'bull' : latest > 3 ? 'neutral' : 'bear',
          latest > 15
            ? 'Fortress'
            : latest > 8
              ? 'Well Covered'
              : latest > 3
                ? 'OK'
                : 'Risky ⚠️'
        )
      );
    }
  }

  const ebitdaMinusCapexCovRow = findRowAny(
    ratios,
    '(EBITDA - Capex) / Gastos por intereses',
    '(EBITDA - Capex) / Interest Expense'
  );
  if (ebitdaMinusCapexCovRow) {
    const vals = getRecentValues(ebitdaMinusCapexCovRow, 6);
    const latest = vals[vals.length - 1];
    debtItems.push(
      makeItem(
        '(EBITDA - Capex) / Interest',
        `Latest: ${latest?.toFixed(1)}x`,
        vals,
        latest > 8 ? 'bull' : latest > 3 ? 'neutral' : 'bear',
        latest > 8 ? 'Well Covered' : latest > 3 ? 'Adequate' : 'Risky'
      )
    );
  }

  const ffoDebtRow = findRowAny(
    ratios,
    'FFO a deuda total',
    'FFO to Total Debt'
  );
  if (ffoDebtRow) {
    const vals = getRecentValues(ffoDebtRow, 6);
    const latest = vals[vals.length - 1];
    debtItems.push(
      makeItem(
        'FFO to Total Debt',
        `Latest: ${latest?.toFixed(2)}x`,
        vals,
        latest > 0.4 ? 'bull' : latest > 0.2 ? 'neutral' : 'bear',
        latest > 0.4 ? 'Strong Deleveraging Capacity' : latest > 0.2 ? 'Adequate' : 'Weak'
      )
    );
  }

  const totalDebtEbitdaRow = findRowAny(
    ratios,
    'Deuda total / EBITDA',
    'Total Debt / EBITDA'
  );
  if (totalDebtEbitdaRow) {
    const vals = getRecentValues(totalDebtEbitdaRow, 6);
    const latest = vals[vals.length - 1];
    debtItems.push(
      makeItem(
        'Total Debt / EBITDA',
        `Latest: ${latest?.toFixed(2)}x`,
        vals,
        latest < 2 ? 'bull' : latest < 3.5 ? 'neutral' : 'bear',
        latest < 2 ? 'Low Leverage' : latest < 3.5 ? 'Manageable' : 'High'
      )
    );
  }

  const netDebtEbitdaCapexRow = findRowAny(
    ratios,
    'Deuda Neta / (EBITDA - Capex)',
    'Net Debt / (EBITDA - Capex)'
  );
  if (netDebtEbitdaCapexRow) {
    const vals = getRecentValues(netDebtEbitdaCapexRow, 6);
    const latest = vals[vals.length - 1];
    debtItems.push(
      makeItem(
        'Net Debt / (EBITDA - Capex)',
        `Latest: ${latest?.toFixed(2)}x`,
        vals,
        latest < 0 ? 'bull' : latest < 2.5 ? 'neutral' : 'bear',
        latest < 0 ? 'Net Cash' : latest < 2.5 ? 'Comfortable' : 'Stretched'
      )
    );
  }

  const cashAssetsRow = findRowAny(ratios, 'Cash / Assets');
  if (cashAssetsRow) {
    const vals = getRecentValues(cashAssetsRow, 6);
    const latest = vals[vals.length - 1];
    debtItems.push(
      makeItem(
        'Cash / Assets',
        `Latest: ${latest?.toFixed(1)}%`,
        vals,
        latest > 15 ? 'bull' : latest > 5 ? 'neutral' : 'bear',
        latest > 20
          ? 'Cash Rich'
          : latest > 15
            ? 'Healthy'
            : latest > 5
              ? 'OK'
              : 'Cash Light'
      )
    );
  }

  if (debtItems.length) {
    const grade = sectionGrade(debtItems);
    results.scores.debt = grade;
    results.sections.push({
      id: 'debt',
      title: 'Debt & Financial Health',
      icon: '🏦',
      grade,
      items: debtItems
    });
  }

  // ══════════════════════════════════════════════════════════
  // 7. CASH FLOW QUALITY
  // ══════════════════════════════════════════════════════════
  const cfItems = [];

  const cfoRow = findRowAny(
    cf,
    'Flujo de caja de las operaciones',
    'Cash From Operations',
    'Operating Cash Flow'
  );
  if (cfoRow) {
    const vals = getRecentValues(cfoRow, 8);
    const latest = vals[vals.length - 1];
    const trend = getTrend(vals);
    const allPositive = vals.every((v) => v > 0);
    cfItems.push(
      makeItem(
        'Cash From Operations',
        `Latest: $${latest?.toFixed(0)}M — Trend: ${trend}`,
        vals,
        allPositive && trend !== 'down'
          ? 'bull'
          : latest > 0
            ? 'neutral'
            : 'bear',
        allPositive
          ? trend === 'up'
            ? 'Growing & Consistent'
            : 'Consistent'
          : 'Inconsistent ⚠️',
        allPositive
          ? 'Positive CFO every year — strong sign'
          : 'Some negative CFO years — investigate'
      )
    );
  }

  // CFO vs Net Income (Accrual check)
  if (cfoRow && netIncRow) {
    const pairs = alignByDate(cfoRow, netIncRow, 6);
    const cfoVals = pairs.map((p) => p.a);
    const niVals = pairs.map((p) => p.b);
    if (cfoVals.length >= 3 && niVals.length >= 3) {
      const allMeaningful = niVals.every((v) => v !== null && v > 0);
      if (!allMeaningful) {
        cfItems.push(
          makeItem(
            'CFO / Net Income (Cash Conversion)',
            'Not meaningful: Net Income ≤ 0 in one or more periods',
            [],
            'neutral',
            'Not meaningful',
            'Use CFO margin / FCF margin when earnings are negative or near zero'
          )
        );
      } else {
        const ratioVals = cfoVals
          .map((v, i) => (niVals[i] ? (v / niVals[i]) * 100 : null))
          .filter((v) => v !== null);
        const avgRatio = avg(ratioVals);
        cfItems.push(
          makeItem(
            'CFO / Net Income (Cash Conversion)',
            `Average: ${avgRatio?.toFixed(0)}%`,
            ratioVals,
            avgRatio > 100 ? 'bull' : avgRatio > 75 ? 'neutral' : 'bear',
            avgRatio > 120
              ? 'Superior Cash Conversion'
              : avgRatio > 100
                ? 'Healthy'
                : avgRatio > 75
                  ? 'Moderate'
                  : 'Poor Conversion ⚠️',
            'CFO should generally exceed Net Income. If not, earnings may include non-cash accruals'
          )
        );
      }
    }
  }

  const capexRow = findRowAny(
    cf,
    'Gastos de capital',
    'Capital Expenditures',
    'CapEx'
  );
  if (capexRow && cfoRow) {
    const pairs = alignByDate(capexRow, cfoRow, 6);
    if (pairs.length >= 2) {
      const ratioVals = pairs
        .map((p) => (p.b ? (Math.abs(p.a) / p.b) * 100 : null))
        .filter((v) => v !== null);
      const latestR = ratioVals[ratioVals.length - 1];
      cfItems.push(
        makeItem(
          'Capex / CFO (Reinvestment Rate)',
          `Latest: ${latestR?.toFixed(0)}%`,
          ratioVals,
          latestR < 30 ? 'bull' : latestR < 50 ? 'neutral' : 'bear',
          latestR < 25
            ? 'Low Reinvestment Need'
            : latestR < 30
              ? 'Efficient'
              : latestR < 50
                ? 'Moderate'
                : 'Heavy Reinvestment',
          'Lower = more FCF available for shareholders'
        )
      );
    }
  }

  // Working Capital changes
  const wcRow = findRowAny(
    cf,
    'Variaciones en el capital circulante',
    'Changes in Working Capital'
  );
  if (wcRow) {
    const vals = getRecentValues(wcRow, 6);
    const latest = vals[vals.length - 1];
    const avgWC = avg(vals);
    cfItems.push(
      makeItem(
        'Working Capital Changes',
        `Latest: $${latest?.toFixed(0)}M | Avg: $${avgWC?.toFixed(0)}M`,
        vals,
        avgWC > 0 ? 'bull' : avgWC > -50 ? 'neutral' : 'bear',
        avgWC > 0 ? 'Source of Cash' : 'Use of Cash',
        'Negative working capital changes can indicate growth requiring more capital'
      )
    );
  }

  // Acquisitions
  const acqRow = findRowAny(cf, 'Adquisiciones', 'Acquisitions');
  if (acqRow) {
    const vals = getRecentValues(acqRow, 6);
    const anyBig = vals.some((v) => v !== null && Math.abs(v) > 100);
    const totalSpent = vals.reduce((s, v) => s + Math.abs(v || 0), 0);
    if (totalSpent > 0) {
      cfItems.push(
        makeItem(
          'Acquisitions Spending',
          `Total (${vals.length}Y): $${totalSpent.toFixed(0)}M`,
          vals.map((v) => Math.abs(v || 0)),
          totalSpent < 50 ? 'bull' : !anyBig ? 'neutral' : 'bear',
          totalSpent < 50
            ? 'Organic Growth'
            : anyBig
              ? 'Acquisition-heavy'
              : 'Selective M&A',
          'Frequent large acquisitions increase integration risk'
        )
      );
    }
  }

  // Debt issued vs repaid
  const debtIssuedRow = findRowAny(
    cf,
    'Deuda emitida',
    'Debt Issued',
    'Borrowings'
  );
  const debtRepaidRow = findRowAny(
    cf,
    'Deuda reembolsada',
    'Debt Repaid',
    'Debt Repayment'
  );
  if (debtIssuedRow && debtRepaidRow) {
    const issued = getRecentValues(debtIssuedRow, 6);
    const repaid = getRecentValues(debtRepaidRow, 6);
    const netDebtChange = issued.map((v, i) => (v || 0) + (repaid[i] || 0)); // repaid is negative
    const totalNet = netDebtChange.reduce((s, v) => s + v, 0);
    cfItems.push(
      makeItem(
        'Net Debt Issuance / Repayment',
        `Net (${issued.length}Y): $${totalNet.toFixed(0)}M`,
        netDebtChange,
        totalNet < 0 ? 'bull' : totalNet < 500 ? 'neutral' : 'bear',
        totalNet < -100
          ? 'Net Deleveraging'
          : totalNet < 0
            ? 'Slight Deleveraging'
            : 'Net Borrower'
      )
    );
  }

  // Net change in cash
  const netCashChangeRow = findRowAny(
    cf,
    'Variación neta de tesorería',
    'Net Change in Cash'
  );
  if (netCashChangeRow) {
    const vals = getRecentValues(netCashChangeRow, 6);
    const positiveYears = vals.filter((v) => v > 0).length;
    cfItems.push(
      makeItem(
        'Net Change in Cash',
        `Positive in ${positiveYears}/${vals.length} years`,
        vals,
        positiveYears >= vals.length * 0.6
          ? 'bull'
          : positiveYears >= vals.length * 0.4
            ? 'neutral'
            : 'bear',
        positiveYears >= vals.length * 0.6
          ? 'Cash Accumulating'
          : 'Cash Volatile'
      )
    );
  }

  if (cfItems.length) {
    const grade = sectionGrade(cfItems);
    results.scores.cashflow = grade;
    results.sections.push({
      id: 'cashflow',
      title: 'Cash Flow Quality',
      icon: '💸',
      grade,
      items: cfItems
    });
  }

  // ══════════════════════════════════════════════════════════
  // 8. EFFICIENCY & OPERATIONS
  // ══════════════════════════════════════════════════════════
  const effItems = [];

  const assetTurnRow = findRowAny(
    ratios,
    'Rotación de activos',
    'Asset Turnover'
  );
  if (assetTurnRow) {
    const vals = getRecentValues(assetTurnRow, 6);
    const latest = vals[vals.length - 1];
    if (latest !== null) {
      effItems.push(
        makeItem(
          'Asset Turnover',
          `Latest: ${latest?.toFixed(2)}x`,
          vals,
          latest > 0.8 ? 'bull' : latest > 0.4 ? 'neutral' : 'bear',
          latest > 1.0
            ? 'Very Efficient'
            : latest > 0.8
              ? 'Efficient'
              : latest > 0.4
                ? 'Average'
                : 'Capital Heavy'
        )
      );
    }
  }

  const recTurnRow = findRowAny(
    ratios,
    'Receivables Turnover',
    'Rotación de cuentas por cobrar'
  );
  if (recTurnRow) {
    const vals = getRecentValues(recTurnRow, 6);
    const latest = vals[vals.length - 1];
    if (latest !== null) {
      effItems.push(
        makeItem(
          'Receivables Turnover',
          `Latest: ${latest?.toFixed(1)}x`,
          vals,
          latest > 8 ? 'bull' : latest > 5 ? 'neutral' : 'bear',
          latest > 10
            ? 'Excellent Collection'
            : latest > 8
              ? 'Good'
              : latest > 5
                ? 'Average'
                : 'Slow Collection',
          `≈ ${(365 / latest).toFixed(0)} days to collect`
        )
      );
    }
  }

  const invTurnRow = findRowAny(
    ratios,
    'Inventory Turnover',
    'Rotación de inventario'
  );
  if (invTurnRow) {
    const vals = getRecentValues(invTurnRow, 6);
    const latest = vals[vals.length - 1];
    if (latest !== null) {
      effItems.push(
        makeItem(
          'Inventory Turnover',
          `Latest: ${latest?.toFixed(1)}x`,
          vals,
          latest > 8 ? 'bull' : latest > 4 ? 'neutral' : 'bear',
          latest > 10
            ? 'Very Lean'
            : latest > 8
              ? 'Efficient'
              : latest > 4
                ? 'Normal'
                : 'Slow Moving',
          `≈ ${(365 / latest).toFixed(0)} days inventory on hand`
        )
      );
    }
  }

  // Cash Conversion Cycle
  const cccRow = findRowAny(
    ratios,
    'Cash Conversion Cycle',
    'Ciclo de conversión'
  );
  if (cccRow) {
    const vals = getRecentValues(cccRow, 6);
    const latest = vals[vals.length - 1];
    if (latest !== null) {
      effItems.push(
        makeItem(
          'Cash Conversion Cycle',
          `Latest: ${latest?.toFixed(0)} days`,
          vals,
          latest < 30 ? 'bull' : latest < 60 ? 'neutral' : 'bear',
          latest < 0
            ? 'Negative CCC (Uses supplier float!)'
            : latest < 30
              ? 'Efficient'
              : latest < 60
                ? 'Normal'
                : 'Long Cycle',
          'Negative CCC = the business generates cash before paying suppliers (very powerful)'
        )
      );
    }
  }

  const dsoRow = findRowAny(
    ratios,
    'Días de ventas pendientes',
    'Days Sales Outstanding',
    'DSO'
  );
  if (dsoRow) {
    const vals = getRecentValues(dsoRow, 6);
    const latest = vals[vals.length - 1];
    if (latest !== null) {
      effItems.push(
        makeItem(
          'Days Sales Outstanding (DSO)',
          `Latest: ${latest?.toFixed(0)} days`,
          vals,
          latest < 45 ? 'bull' : latest < 75 ? 'neutral' : 'bear',
          latest < 30
            ? 'Excellent'
            : latest < 45
              ? 'Quick Collection'
              : latest < 75
                ? 'Normal'
                : 'Slow'
        )
      );
    }
  }

  const dpoRow = findRowAny(
    ratios,
    'Promedio Días a pagar pendientes',
    'Days Payable Outstanding',
    'DPO'
  );
  if (dpoRow) {
    const vals = getRecentValues(dpoRow, 6);
    const latest = vals[vals.length - 1];
    if (latest !== null) {
      effItems.push(
        makeItem(
          'Days Payable Outstanding (DPO)',
          `Latest: ${latest?.toFixed(0)} days`,
          vals,
          latest > 60 ? 'bull' : latest > 35 ? 'neutral' : 'bear',
          latest > 75 ? 'Strong supplier float (supplier financing)' : latest > 35 ? 'Normal' : 'Low payables float'
        )
      );
    }
  }

  const fixedAssetsTurnoverRow = findRowAny(
    ratios,
    'Rotación de activo fijo',
    'Fixed Assets Turnover'
  );
  if (fixedAssetsTurnoverRow) {
    const vals = getRecentValues(fixedAssetsTurnoverRow, 6);
    const latest = vals[vals.length - 1];
    const trend = getTrend(vals);
    if (latest !== null) {
      effItems.push(
        makeItem(
          'Fixed Assets Turnover',
          `Latest: ${latest?.toFixed(2)}x — Trend: ${trend}`,
          vals,
          latest > 4 ? 'bull' : latest > 2 ? 'neutral' : 'bear',
          latest > 6 ? 'Very Efficient' : latest > 4 ? 'Efficient' : latest > 2 ? 'Moderate' : 'Underutilized'
        )
      );
    }
  }

  const wcTurnoverRow = findRowAny(
    ratios,
    'Rotación del capital circulante',
    'Working Capital Turnover'
  );
  if (wcTurnoverRow) {
    const vals = getRecentValues(wcTurnoverRow, 6);
    const latest = vals[vals.length - 1];
    if (latest !== null) {
      const cccLatest = getLatest(cccRow);
      const isNegativeWcModel = latest < 0 && cccLatest !== null && cccLatest < 0;
      effItems.push(
        makeItem(
          'Working Capital Turnover',
          `Latest: ${latest?.toFixed(2)}x`,
          vals,
          isNegativeWcModel
            ? 'neutral'
            : latest > 8
              ? 'bull'
              : latest > 3
                ? 'neutral'
                : 'bear',
          isNegativeWcModel
            ? 'Negative WC model (read with CCC)'
            : latest > 8
              ? 'High Throughput'
              : latest > 3
                ? 'Adequate'
                : 'Heavy Working Capital'
        )
      );
    }
  }

  const cfoToCurrentLiabRow = findRowAny(
    ratios,
    'Flujo de caja operativo a pasivo corriente',
    'Operating Cash Flow to Current Liabilities'
  );
  if (cfoToCurrentLiabRow) {
    const vals = getRecentValues(cfoToCurrentLiabRow, 6);
    const latest = vals[vals.length - 1];
    if (latest !== null) {
      effItems.push(
        makeItem(
          'Operating Cash Flow / Current Liabilities',
          `Latest: ${latest?.toFixed(2)}x`,
          vals,
          latest > 1 ? 'bull' : latest > 0.6 ? 'neutral' : 'bear',
          latest > 1 ? 'Self-funded Current Liabilities' : latest > 0.6 ? 'Acceptable' : 'Thin Coverage'
        )
      );
    }
  }

  const salesEmpRow = findRowAny(
    ratios,
    'Sales Per Employee',
    'Revenue Per Employee'
  );
  if (salesEmpRow) {
    const vals = getRecentValues(salesEmpRow, 6);
    const latest = vals[vals.length - 1];
    const trend = getTrend(vals);
    if (latest !== null) {
      effItems.push(
        makeItem(
          'Revenue Per Employee',
          `Latest: $${(latest / 1000).toFixed(0)}K — Trend: ${trend}`,
          vals,
          trend === 'up' ? 'bull' : trend === 'stable' ? 'neutral' : 'bear',
          trend === 'up'
            ? 'Scaling Well'
            : trend === 'stable'
              ? 'Flat'
              : 'Declining'
        )
      );
    }
  }

  const fcfCfoRow = findRowAny(ratios, 'FCF / CFO');
  if (fcfCfoRow) {
    const vals = getRecentValues(fcfCfoRow, 6);
    const latest = vals[vals.length - 1];
    if (latest !== null) {
      effItems.push(
        makeItem(
          'FCF / CFO (Capital Efficiency)',
          `Latest: ${latest?.toFixed(1)}%`,
          vals,
          latest > 85 ? 'bull' : latest > 70 ? 'neutral' : 'bear',
          latest > 90
            ? 'Ultra Efficient'
            : latest > 85
              ? 'Low Capex Need'
              : latest > 70
                ? 'OK'
                : 'Capex Heavy'
        )
      );
    }
  }

  if (effItems.length) {
    const grade = sectionGrade(effItems);
    results.scores.efficiency = grade;
    results.sections.push({
      id: 'efficiency',
      title: 'Efficiency & Operations',
      icon: '⚙️',
      grade,
      items: effItems
    });
  }

  // ══════════════════════════════════════════════════════════
  // 9. VALUATION (EXPANDED)
  // ══════════════════════════════════════════════════════════
  const valItems = [];

  // Market Cap & EV
  const vmOrIS = vm || is;
  const mcRow = findRowAny(vmOrIS, 'Capitalización bursátil', 'Market Cap');
  const evRow = findRowAny(
    vmOrIS,
    'Valor total de la empresa',
    'Valor empresarial total',
    'Total Enterprise Value',
    'Enterprise Value',
    'TEV'
  );
  const mcLatestForValidation = getLatest(mcRow);
  const evLatestForValidation = getLatest(evRow);
  const evIsValid =
    mcLatestForValidation !== null &&
    evLatestForValidation !== null &&
    mcLatestForValidation > 0 &&
    evLatestForValidation > 0;
  if (mcRow && evRow) {
    const mc = getLatest(mcRow);
    const ev = getLatest(evRow);
    if (mc !== null && ev !== null) {
      if (mc <= 0 || ev <= 0) {
        valItems.push(
          makeItem(
            'Enterprise Value vs Market Cap',
            `MC: $${(mc / 1000).toFixed(1)}B | EV: $${(ev / 1000).toFixed(1)}B`,
            [],
            'info',
            'Invalid valuation datapoint ⚠️',
            'MC/EV at or below zero suggests extraction, mapping, or unit issues. Signal omitted.'
          )
        );
      } else {
        const evPremium = (ev / mc - 1) * 100;
        valItems.push(
          makeItem(
            'Enterprise Value vs Market Cap',
            `MC: $${(mc / 1000).toFixed(1)}B | EV: $${(ev / 1000).toFixed(1)}B (${evPremium > 0 ? '+' : ''}${evPremium.toFixed(0)}%)`,
            [],
            evPremium < 5 ? 'bull' : evPremium < 20 ? 'neutral' : 'bear',
            evPremium < 0
              ? 'Net Cash (EV < MC)'
              : evPremium < 5
                ? 'Minimal Debt'
                : evPremium < 20
                  ? 'Some Debt'
                  : 'Debt-heavy EV',
            'EV > MC by a large margin = significant net debt'
          )
        );
      }
    }
  }

  const peRow = findRowAny(
    vm,
    'NTM Price / Normalized Earnings',
    'NTM P/E',
    'Forward P/E'
  );

  const evRevenueNtmRow = findRowAny(
    vm,
    'NTM EV / Revenues',
    'Valor de empresa / ingresos totales de la empresa NTM'
  );
  if (!evIsValid && evRevenueNtmRow) {
    valItems.push(
      makeItem(
        'EV / Revenues (NTM)',
        'N/A',
        [],
        'info',
        'N/A due to invalid EV/MC ⚠️',
        'EV-based multiple disabled because EV/Market Cap input is invalid.'
      )
    );
  }
  if (evIsValid && evRevenueNtmRow) {
    const vals = getRecentValues(evRevenueNtmRow, 8);
    const latest = vals[vals.length - 1];
    valItems.push(
      makeItem(
        'EV / Revenues (NTM)',
        `Latest: ${latest?.toFixed(2)}x`,
        vals,
        latest < 5 ? 'bull' : latest < 10 ? 'neutral' : 'bear',
        latest < 5 ? 'Reasonable' : latest < 10 ? 'Growth Premium' : 'Rich'
      )
    );
  }
  if (peRow) {
    const vals = getRecentValues(peRow, 8);
    const latest = vals[vals.length - 1];
    const avgPE = avg(vals);
    const belowAvg = latest < avgPE;
    valItems.push(
      makeItem(
        'Forward P/E (NTM)',
        `Latest: ${latest?.toFixed(1)}x | Hist Avg: ${avgPE?.toFixed(1)}x`,
        vals,
        latest < 18 ? 'bull' : latest < 30 ? 'neutral' : 'bear',
        latest < 15
          ? 'Deep Value'
          : latest < 18
            ? 'Cheap'
            : latest < 30
              ? 'Fair'
              : 'Expensive',
        belowAvg
          ? '📉 Below historical average — potentially attractive'
          : '📈 Above historical average'
      )
    );
  }

  // P/S
  const psRow = findRowAny(vm, 'Price / Sales', 'NTM Price / Revenue', 'P/S');
  if (psRow) {
    const vals = getRecentValues(psRow, 8);
    const latest = vals[vals.length - 1];
    valItems.push(
      makeItem(
        'Price / Sales',
        `Latest: ${latest?.toFixed(1)}x`,
        vals,
        latest < 3 ? 'bull' : latest < 8 ? 'neutral' : 'bear',
        latest < 2
          ? 'Deep Value'
          : latest < 3
            ? 'Reasonable'
            : latest < 8
              ? 'Growth Premium'
              : 'Very Rich'
      )
    );
  }

  // P/B
  const pbRow = findRowAny(vm, 'Price / Book', 'P/B', 'Price/Book');
  if (pbRow) {
    const vals = getRecentValues(pbRow, 8);
    const latest = vals[vals.length - 1];
    valItems.push(
      makeItem(
        'Price / Book Value',
        `Latest: ${latest?.toFixed(1)}x`,
        vals,
        latest < 3 ? 'bull' : latest < 8 ? 'neutral' : 'bear',
        latest < 1.5
          ? 'Below Book'
          : latest < 3
            ? 'Reasonable'
            : latest < 8
              ? 'Premium'
              : 'Very Rich',
        latest < 1
          ? 'Trading below book value — potential deep value or value trap'
          : ''
      )
    );
  }

  const evEbitdaRow = findRowAny(
    vm,
    'NTM Total Enterprise Value / EBITDA',
    'EV/EBITDA'
  );
  if (!evIsValid && evEbitdaRow) {
    valItems.push(
      makeItem(
        'EV/EBITDA (NTM)',
        'N/A',
        [],
        'info',
        'N/A due to invalid EV/MC ⚠️',
        'EV-based multiple disabled because EV/Market Cap input is invalid.'
      )
    );
  }
  if (evIsValid && evEbitdaRow) {
    const vals = getRecentValues(evEbitdaRow, 8);
    const latest = vals[vals.length - 1];
    const avgVal = avg(vals);
    valItems.push(
      makeItem(
        'EV/EBITDA (NTM)',
        `Latest: ${latest?.toFixed(1)}x | Hist Avg: ${avgVal?.toFixed(1)}x`,
        vals,
        latest < mt('ev_ebitda', 'bull')
          ? 'bull'
          : latest < mt('ev_ebitda', 'neutral')
            ? 'neutral'
            : 'bear',
        latest < mt('ev_ebitda', 'bull') - 2
          ? 'Cheap'
          : latest < mt('ev_ebitda', 'bull')
            ? 'Attractive'
            : latest < mt('ev_ebitda', 'neutral')
              ? 'Fair'
              : 'Rich'
      )
    );
  }

  // EV/EBIT
  const evEbitRow = findRowAny(
    vm,
    'Enterprise Value / EBIT',
    'EV/EBIT',
    'TEV / EBIT'
  );
  if (!evIsValid && evEbitRow) {
    valItems.push(
      makeItem(
        'EV/EBIT',
        'N/A',
        [],
        'info',
        'N/A due to invalid EV/MC ⚠️',
        'EV-based multiple disabled because EV/Market Cap input is invalid.'
      )
    );
  }
  if (evIsValid && evEbitRow) {
    const vals = getRecentValues(evEbitRow, 8);
    const latest = vals[vals.length - 1];
    valItems.push(
      makeItem(
        'EV/EBIT',
        `Latest: ${latest?.toFixed(1)}x`,
        vals,
        latest < 15 ? 'bull' : latest < 25 ? 'neutral' : 'bear',
        latest < 12
          ? 'Cheap'
          : latest < 15
            ? 'Attractive'
            : latest < 25
              ? 'Fair'
              : 'Expensive'
      )
    );
  }

  // Price / FCF
  const pfcfRow = findRowAny(vm, 'Price / Free Cash Flow', 'P/FCF');
  if (pfcfRow) {
    const vals = getRecentValues(pfcfRow, 8);
    const latest = vals[vals.length - 1];
    valItems.push(
      makeItem(
        'Price / Free Cash Flow',
        `Latest: ${latest?.toFixed(1)}x`,
        vals,
        latest < 20 ? 'bull' : latest < 35 ? 'neutral' : 'bear',
        latest < 15
          ? 'Cheap'
          : latest < 20
            ? 'Attractive'
            : latest < 35
              ? 'Fair'
              : 'Expensive'
      )
    );
  }

  const mcapFcfNtmRow = findRowAny(
    vm,
    'NTM Market Cap / Free Cash Flow'
  );
  if (mcapFcfNtmRow) {
    const vals = getRecentValues(mcapFcfNtmRow, 8);
    const latest = vals[vals.length - 1];
    valItems.push(
      makeItem(
        'Market Cap / Free Cash Flow (NTM)',
        `Latest: ${latest?.toFixed(1)}x`,
        vals,
        latest < 20 ? 'bull' : latest < 35 ? 'neutral' : 'bear',
        latest < 20 ? 'Attractive' : latest < 35 ? 'Fair' : 'Demanding'
      )
    );
  }

  const ltmEvRevenueRow = findRowAny(
    vm,
    'Valor / ingresos totales de la empresa de LTM',
    'LTM EV / Revenues'
  );
  const ltmEvGpRow = findRowAny(
    vm,
    'LTM Total Enterprise Value / Gross Profit'
  );
  const ltmEvEbitdaRow = findRowAny(vm, 'LTM Total Enterprise Value / EBITDA');
  const ltmEvEbitRow = findRowAny(vm, 'LTM Total Enterprise Value / EBIT');
  const ltmEvUfcfRow = findRowAny(
    vm,
    'Valor empresarial total de LTM / Flujo de caja libre sin apalancamiento',
    'LTM EV / Unlevered Free Cash Flow'
  );
  const ltmMcapLfcfRow = findRowAny(
    vm,
    'Capitalización de mercado LTM / Flujo de caja libre apalancado',
    'LTM Market Cap / Levered Free Cash Flow'
  );
  const pNcavRow = findRowAny(vm, 'LTM Price / Net Current Asset Value', 'P/NCAV');

  [
    ['EV / Revenues (LTM)', ltmEvRevenueRow],
    ['EV / Gross Profit (LTM)', ltmEvGpRow],
    ['EV / EBITDA (LTM)', ltmEvEbitdaRow],
    ['EV / EBIT (LTM)', ltmEvEbitRow],
    ['EV / Unlevered FCF (LTM)', ltmEvUfcfRow],
    ['Market Cap / Levered FCF (LTM)', ltmMcapLfcfRow],
    ['Price / NCAV (LTM)', pNcavRow]
  ].forEach(([name, row]) => {
    if (!row) return;
    const vals = getRecentValues(row, 8);
    const latest = vals[vals.length - 1];
    if (latest === null || latest === undefined) return;
    const isNcavMetric = String(name) === 'Price / NCAV (LTM)';
    const isEvMultiple = String(name).startsWith('EV / ');
    if (isEvMultiple && !evIsValid) {
      valItems.push(
        makeItem(
          String(name),
          'N/A',
          [],
          'info',
          'N/A due to invalid EV/MC ⚠️',
          'EV-based multiple disabled because EV/Market Cap input is invalid.'
        )
      );
      return;
    }
    if (isNcavMetric && latest <= 0) {
      valItems.push(
        makeItem(
          String(name),
          `Latest: ${latest?.toFixed(2)}x`,
          vals,
          'info',
          'NCAV not interpretable ⚠️',
          'NCAV is zero/negative, so this multiple is not interpretable and no valuation signal is applied.'
        )
      );
      return;
    }
    valItems.push(
      makeItem(
        String(name),
        `Latest: ${latest?.toFixed(2)}x`,
        vals,
        latest < 15 ? 'bull' : latest < 30 ? 'neutral' : 'bear',
        latest < 15 ? 'Attractive' : latest < 30 ? 'Fair' : 'Expensive'
      )
    );
  });

  const fcfYieldRow = findRowAny(
    vm,
    'Levered Free Cash Flow Yield',
    'FCF Yield'
  );
  if (fcfYieldRow) {
    const vals = getRecentValues(fcfYieldRow, 8);
    const latest = vals[vals.length - 1];
    valItems.push(
      makeItem(
        'FCF Yield (NTM)',
        `Latest: ${latest?.toFixed(1)}%`,
        vals,
        latest > 5 ? 'bull' : latest > 3 ? 'neutral' : 'bear',
        latest > 7
          ? 'Very Attractive'
          : latest > 5
            ? 'Good Value'
            : latest > 3
              ? 'Fair'
              : 'Low Yield'
      )
    );
  }

  // Dividend Yield
  const divYieldRow = findRowAny(
    vm,
    'Dividend Yield',
    'Rentabilidad por dividendo'
  );
  if (divYieldRow) {
    const vals = getRecentValues(divYieldRow, 6);
    const latest = vals[vals.length - 1];
    if (latest !== null && latest > 0) {
      valItems.push(
        makeItem(
          'Dividend Yield',
          `Latest: ${latest.toFixed(2)}%`,
          vals,
          latest > 2 ? 'bull' : latest > 0.5 ? 'neutral' : 'neutral',
          latest > 3
            ? 'High Yield'
            : latest > 2
              ? 'Good Yield'
              : latest > 0.5
                ? 'Modest'
                : 'Token Dividend'
        )
      );
    }
  }

  const pegRow = findRowAny(ratios, 'PEG Ratio', 'PEG');
  if (pegRow) {
    const vals = getRecentValues(pegRow, 4);
    const latest = vals[vals.length - 1];
    if (latest !== null) {
      valItems.push(
        makeItem(
          'PEG Ratio',
          `Latest: ${latest?.toFixed(2)}x`,
          vals,
          latest < 1 ? 'bull' : latest < 2 ? 'neutral' : 'bear',
          latest < 0.8
            ? 'Very Undervalued'
            : latest < 1
              ? 'Undervalued'
              : latest < 2
                ? 'Fair'
                : 'Overvalued',
          'P/E divided by EPS growth rate. <1 = growth at a reasonable price'
        )
      );
    }
  }

  valItems.push(
    makeItem(
      'P/E Context Map (informational)',
      'Cyclical 5-10 · Stable 10-15 · Quality 15-25 · Elite 30-50+',
      [],
      'info',
      'Context only',
      'Use as a map, not a hard rule. Compare growth durability and balance-sheet risk.'
    )
  );

  if (valItems.length) {
    const grade = sectionGrade(valItems);
    results.scores.valuation = grade;
    results.sections.push({
      id: 'valuation',
      title: 'Valuation',
      icon: '🏷️',
      grade,
      items: valItems
    });
  }

  // ══════════════════════════════════════════════════════════
  // 10. DIVIDEND & SHAREHOLDER RETURNS
  // ══════════════════════════════════════════════════════════
  const shItems = [];

  // Dividends Per Share
  const dpsRow = findRowAny(
    is,
    'Dividendos por acción',
    'Dividends Per Share',
    'DPS'
  );
  if (dpsRow) {
    const vals = getRecentValues(dpsRow, 8);
    const latest = vals[vals.length - 1];
    const first = vals[0];
    if (latest !== null && latest > 0) {
      const gr = cagr(first, latest, vals.length - 1);
      const neverCut = vals.every((v, i) => i === 0 || v >= vals[i - 1]);
      shItems.push(
        makeItem(
          'Dividends Per Share',
          `$${latest.toFixed(2)} | ${gr !== null ? `CAGR: ${gr.toFixed(1)}%` : ''}`,
          vals,
          neverCut ? 'bull' : latest > first ? 'neutral' : 'bear',
          neverCut
            ? 'Never Cut — Reliable'
            : latest > first
              ? 'Growing'
              : 'Volatile/Cut',
          neverCut ? '✓ Dividend has never been cut in available history' : ''
        )
      );
    }
  }

  // Payout Ratio
  const payoutRow = findRowAny(is, 'Payout Ratio', 'Ratio de reparto');
  if (payoutRow) {
    const vals = getRecentValues(payoutRow, 6);
    const latest = vals[vals.length - 1];
    if (latest !== null && latest > 0) {
      shItems.push(
        makeItem(
          'Payout Ratio',
          `Latest: ${latest.toFixed(0)}%`,
          vals,
          latest < 50 ? 'bull' : latest < 75 ? 'neutral' : 'bear',
          latest < 40
            ? 'Very Safe'
            : latest < 50
              ? 'Safe'
              : latest < 75
                ? 'Moderate'
                : 'High — Risk of Cut',
          'Payout >80% of earnings leaves little room for growth or downturns'
        )
      );
    }
  }

  // Dividends Paid (absolute)
  const divPaidRow = findRowAny(cf, 'Dividendos pagados', 'Dividends Paid');
  if (divPaidRow) {
    const vals = getRecentValues(divPaidRow, 6);
    const latest = Math.abs(vals[vals.length - 1] || 0);
    const trend = getTrend(vals.map((v) => Math.abs(v || 0)));
    if (latest > 0) {
      shItems.push(
        makeItem(
          'Total Dividends Paid',
          `Latest: $${latest.toFixed(0)}M — Trend: ${trend}`,
          vals.map((v) => Math.abs(v || 0)),
          trend === 'up' ? 'bull' : trend === 'stable' ? 'neutral' : 'bear',
          trend === 'up'
            ? 'Growing Distributions'
            : trend === 'stable'
              ? 'Steady'
              : 'Declining'
        )
      );
    }
  }

  // Share Buybacks
  const buybackRow = findRowAny(
    cf,
    'Recompra de acciones comunes',
    'Common Stock Repurchased',
    'Share Buybacks'
  );
  if (buybackRow) {
    const vals = getRecentValues(buybackRow, 6);
    const hasSignificant = vals.some((v) => v !== null && Math.abs(v) > 10);
    const total = vals.reduce((s, v) => s + Math.abs(v || 0), 0);
    shItems.push(
      makeItem(
        'Share Buybacks',
        hasSignificant
          ? `Total (${vals.length}Y): $${total.toFixed(0)}M`
          : 'Minimal/None',
        vals.map((v) => Math.abs(v || 0)),
        hasSignificant ? 'bull' : 'neutral',
        hasSignificant ? 'Active Buybacks' : 'No Buybacks',
        hasSignificant ? 'Buybacks reduce share count and boost EPS' : ''
      )
    );
  }

  // Share Issuance (dilution check)
  const shareIssRow = findRowAny(
    cf,
    'Emisión de acciones',
    'Share Issuance',
    'Common Stock Issued'
  );
  if (shareIssRow) {
    const vals = getRecentValues(shareIssRow, 6);
    const totalIssued = vals.reduce((s, v) => s + (v || 0), 0);
    if (totalIssued > 50) {
      shItems.push(
        makeItem(
          'Share Issuance (Dilution)',
          `Total (${vals.length}Y): $${totalIssued.toFixed(0)}M issued`,
          vals,
          totalIssued < 50 ? 'bull' : totalIssued < 200 ? 'neutral' : 'bear',
          totalIssued < 50
            ? 'Minimal'
            : totalIssued < 200
              ? 'Some Dilution'
              : 'Heavy Dilution ⚠️'
        )
      );
    }
  }

  // Diluted Shares Outstanding trend
  const sharesRow = findRowAny(
    is,
    'Promedio ponderado de acciones diluidas',
    'Diluted Shares',
    'Weighted Average Diluted'
  );
  if (sharesRow) {
    const vals = getRecentValues(sharesRow, 10);
    const latest = vals[vals.length - 1];
    const first = vals[0];
    const shrinking = latest < first;
    const changePct = first ? ((latest - first) / first) * 100 : 0;
    shItems.push(
      makeItem(
        'Diluted Shares Outstanding',
        `${first?.toFixed(1)}M → ${latest?.toFixed(1)}M (${changePct > 0 ? '+' : ''}${changePct.toFixed(1)}%)`,
        vals,
        shrinking ? 'bull' : Math.abs(changePct) < 3 ? 'neutral' : 'bear',
        shrinking
          ? 'Shrinking ✓'
          : Math.abs(changePct) < 3
            ? 'Stable'
            : 'Diluting ⚠️',
        shrinking
          ? 'Fewer shares = more value per share for existing holders'
          : ''
      )
    );
  }

  // Total shareholder yield = buybacks + dividends / market cap
  if ((buybackRow || divPaidRow) && mcRow) {
    const mc = getLatest(mcRow);
    const bb = buybackRow ? Math.abs(getLatest(buybackRow) || 0) : 0;
    const div = divPaidRow ? Math.abs(getLatest(divPaidRow) || 0) : 0;
    if (mc && mc > 0) {
      const totalYield = ((bb + div) / mc) * 100;
      if (totalYield > 0.5) {
        const extremeYield = totalYield > 300;
        shItems.push(
          makeItem(
            'Total Shareholder Yield',
            `${totalYield.toFixed(1)}% (Buybacks: $${bb.toFixed(0)}M + Dividends: $${div.toFixed(0)}M)`,
            [],
            extremeYield ? 'info' : totalYield > 5 ? 'bull' : 'neutral',
            extremeYield
              ? 'Invalid shareholder return datapoint ⚠️'
              : totalYield > 5
                ? 'Excellent Capital Return'
                : totalYield > 2
                  ? 'Good'
                  : 'Modest',
            extremeYield
              ? 'Likely scaling/formula issue (market cap or units). Signal omitted.'
              : 'Buybacks + dividends as % of market cap'
          )
        );
      }
    }
  }

  if (shItems.length) {
    const grade = sectionGrade(shItems);
    results.scores.shareholder = grade;
    results.sections.push({
      id: 'shareholder',
      title: 'Dividends & Shareholder Returns',
      icon: '🎯',
      grade,
      items: shItems
    });
  }

  // ══════════════════════════════════════════════════════════
  // 11. CONSENSUS ESTIMATES (Forward-looking)
  // ══════════════════════════════════════════════════════════
  if (ce) {
    const estItems = [];

    const ceRevRow = findRowAny(ce, 'Ingresos', 'Revenue');
    if (ceRevRow && revenueRow) {
      const estVals = getRecentValues(ceRevRow, 4);
      const histLatest = getLatest(revenueRow);
      const fwdLatest = estVals[estVals.length - 1];
      if (histLatest && fwdLatest) {
        const impliedGrowth = (fwdLatest / histLatest - 1) * 100;
        estItems.push(
          makeItem(
            'Consensus Revenue Estimate',
            `Fwd: $${fwdLatest.toFixed(0)}M (${impliedGrowth > 0 ? '+' : ''}${impliedGrowth.toFixed(1)}% vs last reported)`,
            estVals,
            impliedGrowth > 10
              ? 'bull'
              : impliedGrowth > 3
                ? 'neutral'
                : 'bear',
            impliedGrowth > 10
              ? 'Strong Growth Expected'
              : impliedGrowth > 3
                ? 'Moderate'
                : 'Slow/Declining'
          )
        );
      }
    }

    const ceEPSRow = findRowAny(ce, 'BPA', 'EPS', 'Earnings Per Share');
    if (ceEPSRow) {
      const vals = getRecentValues(ceEPSRow, 4);
      const trend = getTrend(vals);
      const latest = vals[vals.length - 1];
      estItems.push(
        makeItem(
          'Consensus EPS Estimate',
          `Forward: $${latest?.toFixed(2)} — Trend: ${trend}`,
          vals,
          trend === 'up' ? 'bull' : trend === 'stable' ? 'neutral' : 'bear',
          trend === 'up'
            ? 'Estimates Rising'
            : trend === 'stable'
              ? 'Stable'
              : 'Estimates Falling'
        )
      );
    }

    const ceEBITDARow = findRowAny(ce, 'EBITDA');
    if (ceEBITDARow) {
      const vals = getRecentValues(ceEBITDARow, 4);
      const trend = getTrend(vals);
      estItems.push(
        makeItem(
          'Consensus EBITDA Estimate',
          `Forward: $${vals[vals.length - 1]?.toFixed(0)}M — Trend: ${trend}`,
          vals,
          trend === 'up' ? 'bull' : trend === 'stable' ? 'neutral' : 'bear',
          trend === 'up' ? 'Growing' : 'Flat/Declining'
        )
      );
    }

    const ceFCFRow = findRowAny(ce, 'Free Cash Flow', 'FCF');
    if (ceFCFRow) {
      const vals = getRecentValues(ceFCFRow, 4);
      const trend = getTrend(vals);
      estItems.push(
        makeItem(
          'Consensus FCF Estimate',
          `Forward: $${vals[vals.length - 1]?.toFixed(0)}M — Trend: ${trend}`,
          vals,
          trend === 'up' ? 'bull' : trend === 'stable' ? 'neutral' : 'bear',
          trend === 'up' ? 'Improving' : 'Stable/Declining'
        )
      );
    }

    if (estItems.length) {
      results.sections.push({
        id: 'consensus',
        title: 'Consensus Estimates',
        icon: '🔭',
        grade: 'info',
        items: estItems
      });
    }
  }

  // ══════════════════════════════════════════════════════════
  // 12. ANALYST SENTIMENT
  // ══════════════════════════════════════════════════════════
  if (apt) {
    const analystItems = [];
    const targetRow = findRowAny(
      apt,
      'Media del precio objetivo',
      'Average Price Target'
    );
    const priceRow = findRowAny(apt, 'Precio de cierre', 'Close Price');
    if (targetRow && priceRow) {
      const target = getLatest(targetRow);
      const price = getLatest(priceRow);
      if (target && price) {
        const upside = (target / price - 1) * 100;
        analystItems.push(
          makeItem(
            'Avg Price Target vs Current',
            `Target: $${target.toFixed(0)} vs $${price.toFixed(0)} (${upside > 0 ? '+' : ''}${upside.toFixed(1)}%)`,
            getRecentValues(targetRow, 6),
            upside > 15 ? 'bull' : upside > -5 ? 'neutral' : 'bear',
            upside > 15
              ? 'Significant Upside'
              : upside > 0
                ? 'Modest Upside'
                : 'Downside'
          )
        );
      }
    }

    // High vs Low targets
    const highRow = findRowAny(
      apt,
      'Precio de acción objetivo máximo',
      'Precio objetivo alto',
      'High Price Target'
    );
    const lowRow = findRowAny(
      apt,
      'Precio de acción objetivo mínimo',
      'Precio objetivo bajo',
      'Low Price Target'
    );
    const medianRow = findRowAny(
      apt,
      'Mediana de precio de acción objetivo',
      'Median Price Target'
    );
    const estimateCountRow = findRowAny(
      apt,
      'Precio de acción objetivo (# est.)',
      '# Estimates'
    );
    const targetToPriceRow = findRowAny(
      apt,
      'Precio de acción objetivo / Precio de cierre',
      'Target / Price'
    );
    if (highRow && lowRow) {
      const high = getLatest(highRow);
      const low = getLatest(lowRow);
      if (high && low) {
        const spread = ((high - low) / low) * 100;
        analystItems.push(
          makeItem(
            'Target Range (High/Low)',
            `$${low.toFixed(0)} — $${high.toFixed(0)} (${spread.toFixed(0)}% spread)`,
            [],
            spread < 50 ? 'bull' : spread < 100 ? 'neutral' : 'bear',
            spread < 50
              ? 'High Consensus'
              : spread < 100
                ? 'Moderate Spread'
                : 'Wide Disagreement'
          )
        );
      }
    }

    if (medianRow) {
      const median = getLatest(medianRow);
      if (median) {
        analystItems.push(
          makeItem(
            'Median Price Target',
            `Latest median target: $${median.toFixed(0)}`,
            getRecentValues(medianRow, 6),
            'info',
            'Reference'
          )
        );
      }
    }

    if (estimateCountRow) {
      const estCount = getLatest(estimateCountRow);
      if (estCount) {
        analystItems.push(
          makeItem(
            'Target Coverage (# Estimates)',
            `Latest coverage: ${estCount.toFixed(0)} analysts`,
            getRecentValues(estimateCountRow, 6),
            estCount >= 20 ? 'bull' : estCount >= 10 ? 'neutral' : 'neutral',
            estCount >= 20 ? 'Well-covered' : estCount >= 10 ? 'Moderately covered' : 'Low coverage'
          )
        );
      }
    }

    if (targetToPriceRow) {
      const ratioPct = getLatest(targetToPriceRow);
      if (ratioPct) {
        analystItems.push(
          makeItem(
            'Target / Price (%)',
            `Latest: ${ratioPct.toFixed(1)}%`,
            getRecentValues(targetToPriceRow, 6),
            ratioPct > 110 ? 'bull' : ratioPct > 95 ? 'neutral' : 'bear',
            ratioPct > 110 ? 'Strong implied upside' : ratioPct > 95 ? 'Balanced' : 'Potential downside'
          )
        );
      }
    }

    const buyRow = findRowAny(apt, 'de comprar', 'Buy Rating');
    const holdRow = findRowAny(apt, 'de mantener', 'Hold Rating');
    const sellRow = findRowAny(apt, 'de vender', 'Sell Rating');
    if (buyRow || holdRow || sellRow) {
      const buys = getLatest(buyRow) || 0;
      const holds = getLatest(holdRow) || 0;
      const sells = getLatest(sellRow) || 0;
      const total = buys + holds + sells;
      analystItems.push(
        makeItem(
          'Analyst Consensus',
          `Buy: ${buys} | Hold: ${holds} | Sell: ${sells} (${total} analysts)`,
          [buys, holds, sells],
          buys > holds + sells ? 'bull' : sells > buys ? 'bear' : 'neutral',
          buys > holds + sells
            ? 'Majority Buy'
            : sells > buys
              ? 'Caution'
              : 'Mixed'
        )
      );
    }

    if (analystItems.length) {
      results.sections.push({
        id: 'analyst-noise',
        title: 'Analyst Sentiment (Low weight / noisy — ruido)',
        icon: '🔮',
        grade: 'info',
        items: analystItems
      });
    }
  }

  // ══════════════════════════════════════════════════════════
  // 13. HARMONY & RED FLAGS
  // ══════════════════════════════════════════════════════════
  const harmonyItems = [];
  const niRow = netIncomeRowCore;
  const dilEpsRow = findRowAny(is, 'Diluted EPS', 'EPS Diluted', [
    'BPA',
    'Diluido'
  ]);
  const cfoRowCore = findRowAny(
    cf,
    'Flujo de caja de las operaciones',
    'Operating Cash Flow',
    'Cash From Operations'
  );
  const fcfRowCore = findRowAny(cf, 'Free Cash Flow', 'Flujo de caja libre');
  const gmRow = grossMarginRowCore;
  const nmRow = findRowAny(ratios, 'Net Margin', 'Margen neto');
  const omRow = findRowAny(ratios, 'Operating Margin', 'Margen EBIT');

  const revVals = getRecentValues(revenueRow, 4);
  const niVals = getRecentValues(niRow, 4);
  const epsVals = getRecentValues(dilEpsRow, 4);
  const revY = yoyGrowth(revVals).slice(-1)[0];
  const niY = yoyGrowth(niVals).slice(-1)[0];
  const epsY = yoyGrowth(epsVals).slice(-1)[0];
  const earnY = niY ?? epsY;
  if (Number.isFinite(revY) && Number.isFinite(earnY)) {
    const bearish = revY > 4 && earnY < -4;
    harmonyItems.push(
      makeItem(
        'Revenue vs Earnings Harmony',
        `Revenue YoY ${revY.toFixed(1)}% vs Earnings YoY ${earnY.toFixed(1)}%`,
        [revY, earnY],
        bearish ? 'bear' : revY > 0 && earnY > 0 ? 'bull' : 'neutral',
        bearish
          ? 'Growth-Profit Mismatch'
          : revY > 0 && earnY > 0
            ? 'Aligned Growth'
            : 'Mixed',
        'Revenue rising while NI/EPS falls can signal weak quality growth.',
        { tip: METRIC_TIPS.harmony }
      )
    );
  }

  const gmv = getRecentValues(gmRow, 3);
  const nmv = getRecentValues(nmRow, 3);
  const omv = getRecentValues(omRow, 3);
  if (gmv.length && nmv.length) {
    const gLatest = gmv[gmv.length - 1],
      nLatest = nmv[nmv.length - 1];
    harmonyItems.push(
      makeItem(
        'Gross vs Net Margin Quality',
        `Gross ${gLatest.toFixed(1)}% vs Net ${nLatest.toFixed(1)}%`,
        [gLatest, nLatest],
        gLatest > mt('gross_margin', 'bull') && nLatest < 5
          ? 'bear'
          : nLatest > 10
            ? 'bull'
            : 'neutral',
        gLatest > mt('gross_margin', 'bull') && nLatest < 5
          ? 'Leakage after gross profit'
          : nLatest > 10
            ? 'Healthy conversion'
            : 'Average',
        'Classic heuristic: net margin >10% good, >20% excellent (sector-aware).',
        { tip: METRIC_TIPS.netMargin }
      )
    );
  }

  if (gmv.length >= 2 && omv.length >= 2) {
    const gDelta = gmv[gmv.length - 1] - gmv[0];
    const oDelta = omv[omv.length - 1] - omv[0];
    harmonyItems.push(
      makeItem(
        'Operating Discipline vs Gross Margin',
        `Gross Δ ${gDelta.toFixed(1)}pp | Op Margin Δ ${oDelta.toFixed(1)}pp`,
        [gDelta, oDelta],
        gDelta >= 0 && oDelta < -1.5
          ? 'bear'
          : oDelta >= 0
            ? 'bull'
            : 'neutral',
        gDelta >= 0 && oDelta < -1.5
          ? 'Cost pressure'
          : oDelta >= 0
            ? 'Disciplined'
            : 'Watch costs',
        'If gross margin is stable but operating margin falls, overhead is eating profitability.'
      )
    );
  }

  const cfoVals = getRecentValues(cfoRowCore, 4);
  if (niVals.length >= 2 && cfoVals.length >= 2) {
    const niL = niVals[niVals.length - 1],
      cfoL = cfoVals[cfoVals.length - 1];
    if (niL > 0) {
      const ratio = cfoL / niL;
      harmonyItems.push(
        makeItem(
          'CFO vs Net Income (Accrual Risk)',
          `CFO/NI: ${ratio.toFixed(2)}x`,
          [ratio],
          ratio < 0.75 ? 'bear' : ratio > 1 ? 'bull' : 'neutral',
          ratio < 0.75
            ? 'Weak cash conversion'
            : ratio > 1
              ? 'Cash-backed earnings'
              : 'Acceptable',
          'Low CFO relative to NI can imply accrual-heavy earnings quality risk.',
          { tip: METRIC_TIPS.accruals }
        )
      );
    }
  }

  const fcfValsCore = getRecentValues(fcfRowCore, 4);
  if (revVals.length >= 2 && fcfValsCore.length >= 2) {
    const revT = getTrend(revVals);
    const niT = getTrend(niVals.length ? niVals : epsVals);
    const fcfT = getTrend(fcfValsCore);
    const bear =
      revT === 'up' && niT === 'up' && (fcfT === 'stable' || fcfT === 'down');
    harmonyItems.push(
      makeItem(
        'FCF Consistency Check',
        `Revenue trend: ${revT} | Earnings trend: ${niT} | FCF trend: ${fcfT}`,
        fcfValsCore,
        bear ? 'bear' : fcfT === 'up' ? 'bull' : 'neutral',
        bear
          ? 'Accounting lead, cash lags'
          : fcfT === 'up'
            ? 'Cash confirms'
            : 'Neutral',
        'FCF is the crown jewel: rising profits should eventually show up in free cash flow.',
        { tip: METRIC_TIPS.fcf }
      )
    );
  }
  if (harmonyItems.length) {
    const bullCount = harmonyItems.filter((i) => i.signal === 'bull').length;
    const bearCount = harmonyItems.filter((i) => i.signal === 'bear').length;
    const grade = bearCount >= 2 ? 'poor' : bullCount >= 3 ? 'good' : 'average';
    results.sections.push({
      id: 'harmony',
      title: 'Harmony & Red Flags',
      icon: '🧭',
      grade,
      items: harmonyItems
    });
    results.scores.harmony = grade;
  }

  // Balance sheet reality check
  const balanceItems = [];
  const debtRow = findRowAny(bs, 'Total Debt', 'Deuda total');
  const cashRowCore = findRowAny(
    bs,
    'Cash and Cash Equivalents',
    'Cash And Equivalents',
    'Efectivo y equivalentes',
    'Cash & Equivalents'
  );
  const stInvCore2 = findRowAny(
    bs,
    'Short-Term Investments',
    'Inversiones a corto plazo'
  );
  const stDebtL = sumLatestRows(
    bs,
    ['Short-Term Debt'],
    ['Short Term Borrowings'],
    ['Current Portion', 'Long-Term Debt'],
    ['Current Portion', 'Capital Lease'],
    ['Current Portion', 'Debt'],
    ['Deuda', 'corto']
  );
  const cfoLatest = getLatest(cfoRowCore);
  const debtL = getLatest(debtRow),
    cashL = getLatest(cashRowCore) || 0,
    stInvL = getLatest(stInvCore2) || 0;
  if (debtL !== null) {
    const netDebt = debtL - (cashL + stInvL);
    balanceItems.push(
      makeItem(
        'Net Debt / Net Cash',
        `Net ${netDebt < 0 ? 'Cash' : 'Debt'}: ${Math.abs(netDebt).toFixed(0)}`,
        [netDebt],
        netDebt < 0 ? 'bull' : 'neutral',
        netDebt < 0 ? 'Net Cash (Caja neta)' : 'Net Debt',
        cfoLatest
          ? `Net debt / CFO ≈ ${(netDebt / cfoLatest).toFixed(1)}x`
          : '',
        { tip: METRIC_TIPS.netDebt }
      )
    );
  }
  if (stDebtL !== null && stDebtL > 0 && cashL !== null) {
    const cov = cashL / stDebtL;
    balanceItems.push(
      makeItem(
        'Cash / Short-Term Debt',
        `${cov.toFixed(2)}x coverage`,
        [cov],
        cov >= 1 ? 'bull' : cov >= 0.5 ? 'neutral' : 'bear',
        cov >= 1 ? 'Covered' : cov >= 0.5 ? 'Tight' : 'Refinancing risk'
      )
    );
  }

  const currentPortionLtDebtRow = findRowAny(
    bs,
    'Current Portion of LT Debt',
    'Current Portion of Long-Term Debt',
    'Current Portion Long-Term Debt'
  );
  const ltDebtRowReality = findRowAny(bs, 'Long-Term Debt', 'Long Term Debt', 'Deuda a largo plazo');
  if (currentPortionLtDebtRow && ltDebtRowReality) {
    const cpLatest = getLatest(currentPortionLtDebtRow);
    const ltLatest = getLatest(ltDebtRowReality);
    if (
      cpLatest !== null &&
      ltLatest !== null &&
      cpLatest > 0 &&
      ltLatest > 0 &&
      Math.abs(cpLatest - ltLatest) < Math.max(1, ltLatest * 0.005)
    ) {
      balanceItems.push(
        makeItem(
          'Debt Mapping Integrity Check',
          `Current portion LT debt and Long-term debt are nearly identical (${cpLatest.toFixed(0)} vs ${ltLatest.toFixed(0)})`,
          [cpLatest, ltLatest],
          'info',
          'Possible mapping issue ⚠️',
          'Potential label/source mapping issue: short-term and long-term debt appear duplicated.'
        )
      );
    }
  }

  const ndEbitdaRealityRow = findRowAny(ratios, 'Net Debt / EBITDA');
  if (ndEbitdaRealityRow && debtL !== null) {
    const ndEbitdaLatest = getLatest(ndEbitdaRealityRow);
    if (ndEbitdaLatest !== null) {
      const netDebt = debtL - (cashL + stInvL);
      const signMismatch = (netDebt < 0 && ndEbitdaLatest > 0) || (netDebt > 0 && ndEbitdaLatest < 0);
      if (signMismatch) {
        balanceItems.push(
          makeItem(
            'Net Debt Consistency Check',
            `Net Debt amount sign (${netDebt.toFixed(0)}) vs Net Debt/EBITDA sign (${ndEbitdaLatest.toFixed(2)}x)`,
            [netDebt, ndEbitdaLatest],
            'info',
            'Definition mismatch ⚠️',
            'Net debt sign conflict suggests inconsistent cash/debt definition or data mapping mismatch.'
          )
        );
      }
    }
  }
  const arDays = findRowAny(
    ratios,
    'Days Sales Outstanding',
    'DSO',
    'Días de ventas pendientes'
  );
  const arVals = getRecentValues(arDays, 4);
  if (arVals.length >= 2) {
    const delta = arVals[arVals.length - 1] - arVals[0];
    balanceItems.push(
      makeItem(
        'Receivables Days Trend',
        `DSO Δ ${delta.toFixed(1)} days`,
        arVals,
        delta > 7 ? 'bear' : delta < 0 ? 'bull' : 'neutral',
        delta > 7 ? 'Collections weakening' : delta < 0 ? 'Improving' : 'Stable'
      )
    );
  }
  const invRow2 = findRowAny(bs, 'Inventory', 'Inventories', 'Inventarios');
  const invVals2 = getRecentValues(invRow2, 4);
  if (invVals2.length >= 2 && revVals.length >= 2) {
    const invY = yoyGrowth(invVals2).slice(-1)[0];
    const revYY = yoyGrowth(revVals).slice(-1)[0];
    if (Number.isFinite(invY) && Number.isFinite(revYY)) {
      const spread = invY - revYY;
      const inventoryBuildRisk = spread > 10;
      const deepDestock = invY < -10 && revYY >= 0;
      balanceItems.push(
        makeItem(
          'Inventory vs Revenue Growth',
          `Inventory YoY ${invY.toFixed(1)}% vs Revenue YoY ${revYY.toFixed(1)}% (Δ ${spread.toFixed(1)}pp)`,
          [invY, revYY],
          inventoryBuildRisk ? 'bear' : deepDestock ? 'neutral' : 'neutral',
          inventoryBuildRisk
            ? 'Build faster than sales'
            : deepDestock
              ? 'Destocking / efficiency reset'
              : 'In line',
          inventoryBuildRisk
            ? 'Inventory building much faster than sales can raise obsolescence/manipulation risk.'
            : deepDestock
              ? 'Inventory is shrinking vs sales growth; may reflect destocking/efficiency gains—verify service levels and demand resilience.'
              : 'Inventory and sales trends are broadly aligned.'
        )
      );
    }
  }
  const gw = getLatest(findRowAny(bs, 'Goodwill', 'Fondo de comercio')) || 0;
  const inta =
    getLatest(
      findRowAny(bs, 'Intangible', 'Intangibles', 'Activos intangibles')
    ) || 0;
  const assetsL = getLatest(assetsCore);
  if (assetsL) {
    const pct = ((gw + inta) / assetsL) * 100;
    const impRow =
      findRowAny(
        is,
        'impairment',
        'deterioro',
        'write-down',
        'goodwill impairment'
      ) || findRowAny(cf, 'impairment', 'deterioro', 'write-down');
    const imp = getLatest(impRow);
    balanceItems.push(
      makeItem(
        'Goodwill + Intangibles Concentration',
        `${pct.toFixed(1)}% of assets${imp ? ` | Impairment: ${Math.abs(imp).toFixed(0)}` : ''}`,
        [pct],
        pct > 45 || imp ? 'bear' : pct > 25 ? 'neutral' : 'bull',
        pct > 45 || imp ? 'Impairment watch' : 'Manageable',
        'Acquisition premium may be revised down when impairments appear.'
      )
    );
  }
  const deferredRow = findRowAny(
    bs,
    'Deferred Revenue',
    'Unearned Revenue',
    'Ingresos no devengados',
    'Ingresos diferidos'
  );
  if (deferredRow && revenueRow) {
    const d = getLatest(deferredRow),
      r = getLatest(revenueRow);
    if (d !== null && r) {
      const ratio = (d / r) * 100;
      balanceItems.push(
        makeItem(
          'Deferred Revenue Signal',
          `${ratio.toFixed(1)}% of revenue`,
          getRecentValues(deferredRow, 4),
          ratio > 10 ? 'bull' : 'neutral',
          ratio > 10 ? 'Useful forward demand' : 'Limited',
          'Cash collected for future delivery (ingresos cobrados por adelantado).',
          { tip: METRIC_TIPS.deferredRevenue }
        )
      );
    }
  }
  if (balanceItems.length)
    results.sections.push({
      id: 'balance',
      title: 'Balance Sheet Reality Check',
      icon: '🧱',
      grade:
        balanceItems.filter((i) => i.signal === 'bear').length >= 2
          ? 'poor'
          : 'good',
      items: balanceItems
    });

  // Cash flow truth serum
  const truthItems = [];
  const capexCF = capexCore;
  let fcfComputed = getLatest(fcfRowCore);
  if (
    fcfComputed === null &&
    getLatest(cfoRowCore) !== null &&
    getLatest(capexCF) !== null
  ) {
    fcfComputed = getLatest(cfoRowCore) - Math.abs(getLatest(capexCF));
    truthItems.push(
      makeItem(
        'Computed FCF (CFO - |Capex|)',
        `Derived FCF: ${fcfComputed.toFixed(0)}`,
        [fcfComputed],
        'info',
        'Computed',
        'FCF row missing; using CFO minus absolute capex.',
        { tip: METRIC_TIPS.fcf }
      )
    );
  }
  const daRow2 = findRowAny(
    is,
    'Depreciation',
    'Amortization',
    'Depreciación y amortización',
    'D&A'
  );
  if (capexCF && daRow2) {
    const cap = Math.abs(getLatest(capexCF) || 0),
      da = Math.abs(getLatest(daRow2) || 0);
    if (da > 0) {
      const ratio = cap / da;
      truthItems.push(
        makeItem(
          'Capex / D&A Heuristic',
          `${ratio.toFixed(2)}x`,
          [ratio],
          ratio > 1.5 ? 'neutral' : ratio < 0.7 ? 'bear' : 'bull',
          ratio > 1.5
            ? 'Expansion capex'
            : ratio < 0.7
              ? 'Potential underinvestment'
              : 'Maintenance-like',
          'Heuristic only: compares reinvestment pace vs asset consumption.'
        )
      );
    }
  }
  const buyback = Math.abs(
    getLatest(
      findRowAny(cf, 'Share Buybacks', 'Common Stock Repurchased', 'Recompra')
    ) || 0
  );
  const divPaid = Math.abs(
    getLatest(findRowAny(cf, 'Dividends Paid', 'Dividendos pagados')) || 0
  );
  const debtRepay = Math.abs(
    getLatest(findRowAny(cf, 'Debt Repaid', 'Deuda reembolsada')) || 0
  );
  const cashBuild =
    getLatest(
      findRowAny(cf, 'Net Change in Cash', 'Variación neta de tesorería')
    ) || 0;
  if (fcfComputed !== null) {
    const fcfAbs = Math.abs(fcfComputed);
    const toPctOfFcf = (value) => {
      if (fcfAbs === 0) return null;
      return (value / fcfAbs) * 100;
    };
    const formatUseLine = (label, amount) => {
      const pct = toPctOfFcf(amount);
      return `${label} ${amount.toFixed(0)}${pct === null ? '' : ` (${pct.toFixed(1)}%)`}`;
    };

    truthItems.push(
      makeItem(
        'FCF Uses Summary',
        `FCF total ${fcfComputed.toFixed(0)}; FCF used for ${formatUseLine('buybacks', buyback)}, ${formatUseLine('dividends', divPaid)}, ${formatUseLine('debt paydown', debtRepay)}, ${formatUseLine('cash build', cashBuild)}`,
        [fcfComputed],
        fcfComputed < 0 && buyback + divPaid > 0 ? 'bear' : 'neutral',
        fcfComputed < 0 && buyback + divPaid > 0
          ? 'Returning capital despite negative FCF'
          : 'Capital allocation context'
      )
    );
  }
  const sbcCore = findRowAny(
    cf,
    'Stock-Based Compensation',
    'Compensación basada en acciones',
    'SBC'
  );
  if (sbcCore) {
    const sbc = Math.abs(getLatest(sbcCore) || 0);
    if (fcfComputed > 0) {
      const pct = (sbc / fcfComputed) * 100;
      truthItems.push(
        makeItem(
          'SBC as % of FCF',
          `${pct.toFixed(1)}%`,
          [pct],
          pct > 30 ? 'bear' : pct > 15 ? 'neutral' : 'bull',
          pct > 30 ? 'High dilution cost' : 'Contained',
          'Non-cash in CFO, but real cost via dilution (coste real vía dilución).',
          { tip: METRIC_TIPS.sbc }
        )
      );
    }
    const niLatest = getLatest(niRow);
    if (niLatest > 0) {
      const pctNi = (sbc / niLatest) * 100;
      truthItems.push(
        makeItem(
          'SBC as % of Net Income',
          `${pctNi.toFixed(1)}%`,
          [pctNi],
          pctNi > 20 ? 'bear' : pctNi > 10 ? 'neutral' : 'bull',
          pctNi > 20 ? 'Earnings quality drag' : 'Acceptable',
          '',
          { tip: METRIC_TIPS.sbc }
        )
      );
    }
  }
  if (truthItems.length)
    results.sections.push({
      id: 'cashflow-truth',
      title: 'Cash Flow — The Truth Serum',
      icon: '💧',
      grade:
        truthItems.filter((i) => i.signal === 'bear').length >= 2
          ? 'poor'
          : 'good',
      items: truthItems
    });

  // Valuation philosophy additions
  const valAdd = [];
  const gaapEps = findRowAny(is, ['EPS', 'Diluted'], ['BPA', 'Diluido']);
  const adjEps = findRowAny(
    is,
    'Normalized EPS',
    'Adjusted EPS',
    'EPS (Normalized)',
    'BPA normalizado',
    'BPA ajustado'
  );
  if (gaapEps && adjEps) {
    const g = getLatest(gaapEps),
      a = getLatest(adjEps);
    if (g && a) {
      const gap = ((a - g) / Math.abs(g)) * 100;
      valAdd.push(
        makeItem(
          'GAAP vs Adjusted EPS Gap',
          `GAAP ${g.toFixed(2)} vs Adj ${a.toFixed(2)} (${gap.toFixed(1)}%)`,
          [gap],
          Math.abs(gap) > 15 ? 'bear' : 'neutral',
          Math.abs(gap) > 15 ? 'Large adjustment gap' : 'Close',
          'Large GAAP vs adjusted gaps require validating exclusions (e.g., SBC).'
        )
      );
    }
  }
  const pe = getLatest(findRowAny(vm, 'P/E', 'Price / Earnings', 'NTM P/E'));
  const pfcf = getLatest(findRowAny(vm, 'Price / Free Cash Flow', 'P/FCF'));
  const fcfYield = getLatest(
    findRowAny(
      vm,
      'FCF Yield',
      'Free Cash Flow Yield',
      'Levered Free Cash Flow Yield'
    )
  );
  const marginsWeak =
    (nmv.length >= 2 && nmv[nmv.length - 1] < nmv[0] - 1.5) ||
    (omv.length >= 2 && omv[omv.length - 1] < omv[0] - 1.5);
  const revDown = getTrend(revVals) === 'down';
  const fcfDown = getTrend(fcfValsCore) === 'down';
  const cheap =
    (pe && pe < 12) || (pfcf && pfcf < 12) || (fcfYield && fcfYield > 8);
  if (cheap && (marginsWeak || revDown || fcfDown)) {
    valAdd.push(
      makeItem(
        'Potential Value Trap',
        `Cheap multiple (${pe ? `P/E ${pe.toFixed(1)}` : pfcf ? `P/FCF ${pfcf.toFixed(1)}` : `FCF yield ${fcfYield.toFixed(1)}%`}) + weakening fundamentals`,
        [],
        'bear',
        'Possible value trap (trampa de valor)',
        'Cheap valuation can be deserved when fundamentals deteriorate.'
      )
    );
  }
  if (valAdd.length)
    results.sections.push({
      id: 'valuation-philosophy',
      title: 'Valuation Philosophy Checks',
      icon: '🧮',
      grade: valAdd.some((i) => i.signal === 'bear') ? 'average' : 'good',
      items: valAdd
    });
  // ══════════════════════════════════════════════════════════
  // OVERALL SCORE
  // ══════════════════════════════════════════════════════════
  const gradeValues = { excellent: 4, good: 3, average: 2, poor: 1 };
  const scoreKeys = Object.keys(results.scores);
  const validScores = results.sections
    .filter((sec) => gradeValues[sec.grade])
    .map((sec) => ({
      grade: gradeValues[sec.grade],
      weight: avg(sec.items.map((i) => i.confidence || 0.5)) || 0.5
    }));
  if (validScores.length) {
    const weightedSum = validScores.reduce(
      (s, item) => s + item.grade * item.weight,
      0
    );
    const weightTotal = validScores.reduce((s, item) => s + item.weight, 0);
    const avgScore = weightedSum / weightTotal;
    results.overall =
      avgScore >= 3.5
        ? 'excellent'
        : avgScore >= 2.5
          ? 'good'
          : avgScore >= 1.5
            ? 'average'
            : 'poor';
    results.overallScore = avgScore;
  }

  // Count total metrics
  results.totalMetrics = results.sections.reduce(
    (s, sec) => s + sec.items.length,
    0
  );

  return results;
}

// =========================================================
// RENDERER
// =========================================================
function gradeLabel(g) {
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

function buildPrintableDashboardPanel(data, results, industrySelection = null) {
  const sectionBlocks = (results.sections || [])
    .map((section) => {
      const sectionTitle = `${section.icon || '•'} ${localizeDynamicText(section.title || '')}`;
      const metrics = (section.items || [])
        .map((item) => {
          const metricName = localizeDynamicText(item.name || 'Metric');
          const metricDetail = localizeDynamicText(item.detail || '');
          const metricValues = localizeDynamicText(item.explanation || '');
          const signalText = localizeDynamicText(item.signalText || '');
          const signal =
            item.signal === 'bull'
              ? currentLang === 'es'
                ? '🟢 Positiva'
                : '🟢 Positive'
              : item.signal === 'bear'
                ? currentLang === 'es'
                  ? '🔴 Negativa'
                  : '🔴 Negative'
                : currentLang === 'es'
                  ? '🟡 Neutral'
                  : '🟡 Neutral';
          const note = localizeDynamicText(item.note || '');
          const value = item.value != null ? ` (${item.value})` : '';
          return `<li>
            <strong>${escapeHtml(metricName)}</strong>${escapeHtml(value)}
            ${metricDetail ? `<br/><span>${escapeHtml(metricDetail)}</span>` : ''}
            ${metricValues ? `<br/><span>${escapeHtml(metricValues)}</span>` : ''}
            <br/><span><strong>${escapeHtml(currentLang === 'es' ? 'Señal' : 'Signal')}:</strong> ${escapeHtml(signal)}${signalText ? ` · ${escapeHtml(signalText)}` : ''}</span>
            ${note ? `<br/><span>${escapeHtml(note)}</span>` : ''}
          </li>`;
        })
        .join('');
      return `<section><h3>${escapeHtml(sectionTitle)}</h3><ul>${metrics}</ul></section>`;
    })
    .join('');

  const scoreLine = `${currentLang === 'es' ? 'Puntuación global' : 'Overall score'}: ${results.overallScore?.toFixed(1) || '-'} / 4.0`;
  const industryLine = industrySelection
    ? `${industrySelection.code} · ${industrySelection.name} (${industrySelection.profile})`
    : currentLang === 'es'
      ? 'Sin industria seleccionada'
      : 'No selected industry';

  return `<div class="printable-panel fade-up">
    <div class="printable-header">
      <h2>${escapeHtml(data.ticker ? `${data.ticker} — ${data.company}` : data.company)}</h2>
      <p>${escapeHtml(data.period || '')}</p>
      <p class="printable-help">${currentLang === 'es' ? 'Vista simplificada para imprimir. Puedes usar la impresión del navegador (Ctrl/Cmd+P).' : 'Simplified print-friendly view. Use your browser print dialog (Ctrl/Cmd+P).'}</p>
    </div>
    <div class="printable-summary">
      <h3>${currentLang === 'es' ? 'Resumen rápido' : 'Quick summary'}</h3>
      <p>${escapeHtml(scoreLine)}</p>
      <p>${escapeHtml(currentLang === 'es' ? 'Industria:' : 'Industry:')} ${escapeHtml(industryLine)}</p>
      <p>${escapeHtml(currentLang === 'es' ? `Métricas analizadas: ${results.totalMetrics}` : `Analyzed metrics: ${results.totalMetrics}`)}</p>
    </div>
    ${sectionBlocks}
  </div>`;
}

function renderTrendBars(values, labels = []) {
  const series = Array.isArray(values) ? values : [];
  const points = Math.max(series.length, labels.length);
  if (!points) return '';

  const numeric = series.filter(
    (v) => v !== null && v !== undefined && !isNaN(v)
  );
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
    })
    .join(
      ''
    )}</div>`;
}

export function renderDashboard(data, results, industrySelection = null) {
  const overallLabel = gradeLabel(results.overall || 'average');

  let html = `
    <div class="dash-header fade-up">
      <div>
        <h2>${data.ticker ? data.ticker + ' — ' : ''}${data.company}</h2>
        <span class="price">${data.price || ''} ${data.period ? '• ' + localizeDynamicText(data.period) : ''} • ${results.totalMetrics} ${t('metricsAnalyzed', 'metrics analyzed')}</span>
      </div>
      <div class="header-actions">
        <button class="btn-toggle-sections" onclick="switchDashboardTab('print')">${currentLang === 'es' ? '🖨️ Imprimir' : '🖨️ Print'}</button>
        <button id="toggleSectionsBtn" class="btn-toggle-sections" onclick="toggleAllSections()">${t('collapseAll', 'Collapse all sections')}</button>
        <button class="btn-back" onclick="goBack()">${t('newAnalysis', '← New Analysis')}</button>
      </div>
    </div>
    <div class="dashboard-tabs fade-up">
      <button class="dashboard-tab active" data-tab="analysis" onclick="switchDashboardTab('analysis')">${currentLang === 'es' ? 'Análisis' : 'Analysis'}</button>
      <button class="dashboard-tab" data-tab="industry" onclick="switchDashboardTab('industry')">${currentLang === 'es' ? 'KPIs por industria' : 'Industry KPIs'}</button>
      <button class="dashboard-tab" data-tab="print" onclick="switchDashboardTab('print')">${currentLang === 'es' ? '🖨️ Imprimible' : '🖨️ Printable'}</button>
    </div>
    <div class="dashboard-panel" data-panel="analysis">
  `;

  const byId = (id) => results.sections.find((s) => s.id === id);
  const catDefs = [
    {
      k: 'Quality',
      sec: ['harmony', 'cashflow-truth', 'margins', 'cashflow'],
      href: '#harmony'
    },
    { k: 'Moat', sec: ['moat', 'margins'], href: '#moat' },
    {
      k: 'Financial Risk',
      sec: ['balance', 'balance-composition', 'debt'],
      href: '#balance'
    },
    {
      k: 'Valuation',
      sec: ['valuation', 'valuation-philosophy'],
      href: '#valuation-philosophy'
    }
  ];
  html += `<div class="score-row">`;
  catDefs.forEach((cat) => {
    const found = cat.sec.map(byId).filter(Boolean);
    const signals = found.flatMap((f) => f.items || []);
    const bears = signals.filter((i) => i.signal === 'bear').length;
    const bulls = signals.filter((i) => i.signal === 'bull').length;
    const grade = bears >= 2 ? 'poor' : bulls > bears ? 'good' : 'average';
    const driver = localizeDynamicText(signals[0]?.name || 'Not enough data');
    const light = grade === 'poor' ? '🔴' : grade === 'good' ? '🟢' : '🟡';
    html += `<div class="score-card ${grade} fade-up"><div class="label">${localizeDynamicText(`2-minute ${cat.k}`)}</div><div class="value">${light} ${gradeLabel(grade)}</div><div class="detail">${driver} · <a href="${cat.href}" style="color:var(--accent)">${localizeDynamicText('see details')}</a></div></div>`;
  });
  html += `</div>`;

  const cards = [
    {
      label: localizeDynamicText('Overall Health'),
      value: overallLabel,
      grade: results.overall,
      detail: `${currentLang === 'es' ? 'Puntuación' : 'Score'}: ${results.overallScore?.toFixed(1)}/4.0`
    },
    ...Object.entries(results.scores).map(([k, g]) => ({
      label: localizeDynamicText(k.charAt(0).toUpperCase() + k.slice(1)),
      value: gradeEmoji(g) + ' ' + gradeLabel(g),
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
        <h3>${localizeDynamicText(sec.title)}</h3>
        <span class="metric-count">${sec.items.length} ${t('metricsAnalyzed', 'metrics analyzed')}</span>
        <span class="badge ${badgeCls}">${gradeLabel(sec.grade)}</span>
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
            <div class="metric-name">${localizeDynamicText(item.name)}${item.tip ? ` <span class="tip" data-tip="${localizeDynamicText(item.tip)}">ⓘ</span>` : ''} <span class="tip" data-tip="${t('scoreConditions', 'Score conditions')}: ${localizeDynamicText(item.scoreRule || item.explanation || item.signalText || '')}">🏷️</span></div>
            <div class="metric-detail">${localizeDynamicText(item.detail || '')}</div>
            ${item.explanation ? `<div class="metric-values">${localizeDynamicText(item.explanation)}</div>` : ''}
            <div class="metric-values">${t('confidence', 'Confidence')}: ${(item.confidence * 100).toFixed(0)}%</div>
            ${renderTrendBars(item.values?.fullValues || item.values, item.values?.fullLabels || item.labels || [])}
          </div>
          <div class="signal ${sigCls}">
            <span class="dot ${dotCls}"></span>
            ${localizeDynamicText(item.signalText)}
          </div>
        </div>
      `;
    });
    html += `</div></div></div>`;
  });

  html += buildSummary(data, results);
  html += `</div><div class="dashboard-panel" data-panel="industry" style="display:none">${buildIndustryPanel(data, results, industrySelection)}</div><div class="dashboard-panel" data-panel="print" style="display:none">${buildPrintableDashboardPanel(data, results, industrySelection)}</div>`;
  return html;
}

export function updateToggleSectionsButton() {
  const btn = document.getElementById('toggleSectionsBtn');
  if (!btn) return;
  const heads = Array.from(document.querySelectorAll('.section-head'));
  if (!heads.length) {
    btn.textContent = t('openAll', 'Open all sections');
    return;
  }
  const allOpen = heads.every((h) => h.classList.contains('open'));
  btn.textContent = allOpen
    ? t('collapseAll', 'Collapse all sections')
    : t('openAll', 'Open all sections');
}

export function toggleSection(headEl) {
  headEl.classList.toggle('open');
  updateToggleSectionsButton();
}

export function toggleAllSections() {
  const heads = Array.from(document.querySelectorAll('.section-head'));
  if (!heads.length) return;
  const allOpen = heads.every((h) => h.classList.contains('open'));
  heads.forEach((h) => h.classList.toggle('open', !allOpen));
  updateToggleSectionsButton();
}

function buildSummary(data, results) {
  const includeNoise = document.getElementById('includeAnalystNoise')?.checked;
  const strengths = [];
  const risks = [];
  const highConfidence = [];
  const lowConfidence = [];

  results.sections.forEach((sec) => {
    if (!includeNoise && sec.title.toLowerCase().includes('analyst')) return;
    sec.items.forEach((item) => {
      if (item.signal === 'bull')
        strengths.push(item.name + ': ' + item.signalText);
      if (item.signal === 'bear')
        risks.push(item.name + ': ' + item.signalText);
      (item.confidence >= 0.66 ? highConfidence : lowConfidence).push(
        item.name
      );
    });
  });

  const harmonySec = results.sections.find((s) => s.id === 'harmony');
  const harmonyVerdict = harmonySec
    ? harmonySec.grade === 'poor'
      ? currentLang === 'es'
        ? '⚠️ La armonía muestra desajustes relevantes.'
        : '⚠️ Harmony has meaningful mismatches.'
      : harmonySec.grade === 'good'
        ? currentLang === 'es'
          ? '✅ Los estados están mayormente alineados.'
          : '✅ Statements are mostly aligned.'
        : currentLang === 'es'
          ? '➖ Señales de armonía mixtas.'
          : '➖ Mixed harmony signals.'
    : currentLang === 'es'
      ? 'Datos insuficientes.'
      : 'Not enough data.';

  return `
  <div class="summary-box fade-up delay-6">
    <h4>📋 ${currentLang === 'es' ? 'Resumen del Análisis' : 'Analysis Summary'} — ${data.ticker || data.company}</h4>
    <p style="margin-bottom:.5rem"><strong>${currentLang === 'es' ? 'Veredicto de armonía' : 'Harmony verdict'}:</strong> ${harmonyVerdict}</p>
    <p><strong style="color:var(--green)">${currentLang === 'es' ? 'Fortalezas principales (3)' : 'Top strengths (3)'}:</strong> ${strengths.length ? strengths.slice(0, 3).map(localizeDynamicText).join(' · ') : currentLang === 'es' ? 'No se identificaron con los datos disponibles.' : 'None identified from available data.'}</p>
    <p style="margin-top:.45rem"><strong style="color:var(--red)">${currentLang === 'es' ? 'Riesgos principales (3)' : 'Top risks (3)'}:</strong> ${risks.length ? risks.slice(0, 3).map(localizeDynamicText).join(' · ') : currentLang === 'es' ? 'No se detectaron banderas rojas relevantes.' : 'No major red flags detected.'}</p>
    <p style="margin-top:.45rem"><strong>${currentLang === 'es' ? 'Señales de alta confianza' : 'High confidence signals'}:</strong> ${highConfidence.slice(0, 6).map(localizeDynamicText).join(' · ') || (currentLang === 'es' ? 'Limitado' : 'Limited')}</p>
    <p style="margin-top:.35rem"><strong>${currentLang === 'es' ? 'Baja confianza / faltan datos' : 'Low confidence / missing data'}:</strong> ${lowConfidence.slice(0, 6).map(localizeDynamicText).join(' · ') || (currentLang === 'es' ? 'Mínimo' : 'Minimal')}</p>
    <p style="margin-top:.75rem;font-size:.78rem;color:var(--text-dim)">
      ${currentLang === 'es' ? '⚠️ Herramienta de cribado. Usa siempre los informes primarios y tu propia diligencia debida.' : '⚠️ Screening tool only. Use primary filings and your own due diligence.'}
    </p>
  </div>`;
}

export function populateIndustrySelector() {
  const sel = document.getElementById('industrySelect');
  if (!sel || !Array.isArray(window.GICS_INDUSTRIES)) return;
  const current = sel.value || window.GICS_INDUSTRIES[0]?.code;
  sel.innerHTML = window.GICS_INDUSTRIES.slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => `<option value="${i.code}">${i.name} (${i.code})</option>`)
    .join('');
  if (current) sel.value = current;
}

onLanguageChange(() => {
  if (typeof populateIndustrySelector === 'function') populateIndustrySelector();
  if (typeof updateToggleSectionsButton === 'function')
    updateToggleSectionsButton();
});

export function getIndustrySelection() {
  const code = document.getElementById('industrySelect')?.value || '';
  if (!code) return null;
  return window.GICS_INDUSTRIES?.find((i) => i.code === code) || null;
}

function normalizeSimple(v) {
  return String(v || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildAvailabilityIndex(data, results) {
  const labels = [];
  Object.values(data.sections || {}).forEach((sec) =>
    (sec?.rows || []).forEach((r) => labels.push(r.label))
  );
  (results.sections || []).forEach((sec) =>
    (sec.items || []).forEach((i) => labels.push(i.name))
  );
  const clean = labels.map(normalizeSimple).filter(Boolean);
  return { blob: clean.join(' | ') };
}

function hasAny(index, terms) {
  return terms.some((term) => index.blob.includes(normalizeSimple(term)));
}

function isKpiAvailable(kpi, index) {
  const k = normalizeSimple(kpi);
  const rules = [
    {
      terms: ['fcf', 'free cash flow', 'cash conversion', 'cfo'],
      match: [
        'free cash flow',
        'cash from operations',
        'operating cash flow',
        'fcf'
      ]
    },
    {
      terms: ['margin', 'gross margin', 'ebitda'],
      match: [
        'gross margin',
        'operating margin',
        'ebitda margin',
        'gross profit',
        'operating income'
      ]
    },
    {
      terms: ['working capital'],
      match: [
        'current assets',
        'current liabilities',
        'accounts receivable',
        'inventory',
        'accounts payable'
      ]
    },
    { terms: ['inventory'], match: ['inventory', 'inventories'] },
    {
      terms: ['debt', 'leverage', 'net debt'],
      match: [
        'net debt',
        'long-term debt',
        'short-term borrowings',
        'total liabilities'
      ]
    },
    {
      terms: ['roic', 'roe', 'roa'],
      match: ['roic', 'roe', 'roa', 'return on']
    },
    {
      terms: ['revenue', 'volume', 'price mix', 'asp'],
      match: ['revenue', 'ingresos', 'price / sales']
    },
    {
      terms: ['book value', 'p b', 'p tbv'],
      match: ['book value', 'tangible book', 'price / book']
    },
    {
      terms: ['nim', 'npl', 'cet1', 'ldr'],
      match: ['interest expense', 'allowance', 'book value', 'loan']
    },
    {
      terms: ['capex'],
      match: ['capital expenditures', 'capex', 'property plant']
    }
  ];
  for (const rule of rules) {
    if (rule.terms.some((t) => k.includes(normalizeSimple(t))))
      return hasAny(index, rule.match);
  }
  const tokens = k.split(' ').filter((w) => w.length >= 4);
  return tokens.some((tok) => index.blob.includes(tok));
}

function buildIndustryPanel(data, results, industry) {
  if (!industry) {
    return `<div class="industry-empty">${currentLang === 'es' ? 'No seleccionaste una industria concreta. Selecciónala en la pantalla inicial para activar heurísticas GICS.' : 'No industry selected. Pick one on landing to activate GICS heuristics.'}</div>`;
  }
  const profile = window.INDUSTRY_PROFILES?.[industry.profile];
  if (!profile) return '';

  const index = buildAvailabilityIndex(data, results);
  const valuation = profile.valuation
    .split('·')
    .map((v) => v.trim())
    .filter(Boolean);
  const valuationAvailable = valuation.filter((v) => isKpiAvailable(v, index));
  const kpis = profile.kpis
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  const availableKpis = kpis.filter((k) => isKpiAvailable(k, index));

  return `<div class="industry-panel fade-up">
    <div class="industry-head">
      <h3>${industry.code} · ${industry.name}</h3>
      <p>${currentLang === 'es' ? 'Perfil heurístico' : 'Heuristic profile'}: <strong>${industry.profile}</strong></p>
    </div>
    <div class="industry-grid">
      <div class="industry-card">
        <h4>${currentLang === 'es' ? 'Múltiplos a priorizar (disponibles)' : 'Priority valuation metrics (available)'}</h4>
        <ul>${valuationAvailable.length ? valuationAvailable.map((v) => `<li>${v}</li>`).join('') : `<li>${currentLang === 'es' ? 'Sin cobertura con este input.' : 'No coverage with current input.'}</li>`}</ul>
      </div>
      <div class="industry-card">
        <h4>${currentLang === 'es' ? 'KPIs relevantes detectados' : 'Detected relevant KPIs'}</h4>
        ${availableKpis.length ? `<ul>${availableKpis.map((k) => `<li><strong>${k}</strong> — ${currentLang === 'es' ? 'Relevante para esta industria.' : 'Relevant for this industry.'}</li>`).join('')}</ul>` : `<p>${currentLang === 'es' ? 'No hay KPIs detectables con los datos cargados. (No se muestran los no disponibles).' : 'No profile KPIs were detectable from the uploaded financials. (Unavailable KPIs are hidden).'}</p>`}
      </div>
    </div>
  </div>`;
}

export function switchDashboardTab(tab) {
  document
    .querySelectorAll('.dashboard-tab')
    .forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tab));
  document.querySelectorAll('.dashboard-panel').forEach((panel) => {
    panel.style.display = panel.dataset.panel === tab ? 'block' : 'none';
  });
}

// =========================================================
// MAIN
// =========================================================
function showDashboard() {
  document.getElementById('landing').style.display = 'none';
  const d = document.getElementById('dashboard');
  d.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLanding() {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('landing').style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
  // optional: keep previous pasted text; if you want to clear it, uncomment next line
  // document.getElementById('dataInput').value = '';
  document.getElementById('dashboard').innerHTML = '';
  showLanding();
}

// Profile UI toggle
function syncCustomProfileUI() {
  const sel = document.getElementById('profileSelect');
  const wrap = document.getElementById('customProfileWrap');
  if (!sel || !wrap) return;
  wrap.style.display = sel.value === 'custom' ? 'block' : 'none';
}

function analyzeData() {
  const raw = document.getElementById('dataInput').value.trim();
  const errEl = document.getElementById('error-msg');
  errEl.style.display = 'none';
  errEl.textContent = '';

  if (!raw || raw.length < 100) {
    errEl.textContent =
      currentLang === 'es'
        ? 'Pega todos los datos financieros de TIKR (parecen demasiado cortos).'
        : 'Please paste the full TIKR financial data (it seems too short).';
    errEl.style.display = 'block';
    return;
  }

  try {
    const data = parseTIKR(raw);

    // Basic sanity: did we actually parse any table rows?
    const secCount = Object.keys(data.sections || {}).length;
    const rowCount = Object.values(data.sections || {}).reduce(
      (s, sec) => s + (sec?.rows?.length || 0),
      0
    );

    if (secCount === 0 || rowCount === 0) {
      errEl.textContent =
        currentLang === 'es'
          ? 'No se detectaron tablas TIKR. Asegúrate de pegar tablas markdown (líneas que empiezan por "|"), incluyendo cabecera con fechas.'
          : 'No TIKR tables detected. Make sure you pasted the markdown tables (lines starting with "|") including the header row with dates.';
      errEl.style.display = 'block';
      return;
    }

    const selected = document.getElementById('profileSelect').value;

    let customThresholds = null;
    let engineProfile = selected;

    if (selected === 'custom') {
      customThresholds = parseCustomProfile();
      if (!customThresholds) {
        errEl.textContent =
          currentLang === 'es'
            ? 'El JSON del perfil personalizado es inválido. Corrígelo e inténtalo de nuevo.'
            : 'Custom profile JSON is invalid. Fix the JSON and try again.';
        errEl.style.display = 'block';
        return;
      }
      // Use default profile logic + override thresholds
      engineProfile = 'default';
    }

    const results = analyze(data, engineProfile, { customThresholds });
    const industrySelection = getIndustrySelection();
    renderDashboard(data, results, industrySelection);
    showDashboard();
  } catch (e) {
    console.error(e);
    errEl.textContent =
      currentLang === 'es'
        ? 'Falló el parseo/análisis. Abre la consola DevTools para ver más detalles.'
        : 'Parsing/analyzing failed. Open DevTools console for details.';
    errEl.style.display = 'block';
  }
}
