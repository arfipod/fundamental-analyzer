# Fundamental Analyzer

Static React + Vite + TypeScript app to analyze pasted TIKR markdown exports and produce a financial health dashboard.

## Architecture (layered)

- **Domain (`src/domain`)**
  - `types/`: financial and analysis contracts.
  - `parser/parseInput.ts`: strict markdown parser (pure, no DOM).
  - `analysis/`: metric extraction, scoring, categories, scorecards.
  - `industry/`: GICS mapping + actionable profile rules (weights, thresholds, focus metrics).
  - `i18n/`: typed translation keys and dictionaries.
- **Application (`src/application`)**
  - `analyze.ts`: use-case orchestration (`parse -> compute -> score -> DashboardVM`).
  - `viewmodels/dashboardVM.ts`: serializable UI contract.
- **UI (`src/ui`)**
  - React-only rendering (`AnalyzerPage` + hooks).
  - No `dangerouslySetInnerHTML`, no `window` UI globals.
- **Infrastructure (`src/infrastructure`)**
  - `localStorage` adapter (`fundamentalAnalyzerLang` key).
  - console logger + fixture loader.

## Data flow

1. User pastes markdown export.
2. `parseInput(raw)` normalizes sections, periods, rows, numeric cells.
3. `analyze(parsed, { industryCode })` applies industry profile rules.
4. UI renders `DashboardVM` with tabs, scorecards, and collapsible sections.

## Developer guide

### Add a metric
1. Add metric id in `src/domain/types/analysis.ts`.
2. Compute value in `src/domain/analysis/computeMetrics.ts`.
3. Add thresholds in `scoreMetrics.ts` and category mapping in `buildCategoryDiagnostics.ts`.

### Add an industry rule
1. Add or edit profile in `src/domain/industry/profiles.ts` (`weights`, `thresholds`, `focus`).
2. Map a GICS code to that profile in `src/domain/industry/gics.ts`.

### Add translations
1. Add key in `src/domain/i18n/keys.ts`.
2. Fill both `src/domain/i18n/en.ts` and `src/domain/i18n/es.ts`.

## QA checklist

- [ ] Paste fixture markdown from `/test-data` and run analysis.
- [ ] Switch ES/EN and verify persistence after reload.
- [ ] Search/filter industry selector.
- [ ] Verify open/close all + per-section collapse.
- [ ] Verify industry tab shows valuation + KPI context and applied profile.

## Scripts

```bash
npm install
npm run dev
npm run test
npm run lint
npm run typecheck
npm run build
```


## Quality gates

Run these before opening a PR:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Known limitations / next steps

- Parser currently focuses on markdown table exports and common TIKR labels.
- Only a first actionable set of industry profiles is included.
- Future work: richer bank-specific metrics (NIM/CET1), better LTM handling, extended fixtures.
