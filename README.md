# Fundamental Analyzer (React + Vite + TypeScript)

## 1) Project overview
Fundamental Analyzer ingests pasted TIKR-style financial exports and generates a health dashboard with scorecards, category diagnostics, and industry-aware context.

## 2) Quick start
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

Build and preview:
```bash
npm run build
npm run preview
```

Quality checks:
```bash
npm run typecheck
npm run lint
npm run format
npm run test
```

## 3) Deployment notes (static hosting)
- This is a static Vite build (`dist/`).
- Deploy `dist` to GitHub Pages, Netlify, Vercel static output, S3, or any static server.
- `fundamental-analyzer.html` remains as a compatibility redirect to `/`.

## 4) Architecture overview (layered / hexagonal)
- **Domain**: scoring engine, metrics primitives, industry datasets/heuristics, translator.
- **Application**: parse input, run analysis use-case, produce UI VM.
- **Ports**: storage and logger interfaces.
- **Infrastructure**: localStorage adapter (with migration), console logger, fixture loader.
- **UI**: React page/hooks and styles.

## 5) Folder map
- `src/app`: bootstrap + composition root.
- `src/domain`: pure/business-oriented modules and datasets.
- `src/application`: orchestration use-cases.
- `src/ports`: interfaces.
- `src/infrastructure`: adapters/implementations.
- `src/ui`: React page/hooks/viewmodels/styles.
- `test-data`: manual fixture markdown files.

## 6) Data flow
1. User pastes TIKR markdown into textarea.
2. `parseInput` normalizes tables into internal section rows.
3. `runAnalysis` computes metric items, signals, grades, and summaries.
4. Dashboard HTML VM is produced and rendered in the UI.
5. Industry selection overlays profile-relevant KPIs/valuation hints.

## 7) i18n system
- Dictionaries live in `src/domain/i18n`.
- Language fallback strategy: selected language -> English -> key.
- Persistence key preserved: `fundamentalAnalyzerLang`.
- Storage migration runs on bootstrap to ensure supported language values.

## 8) How to extend
### Add a metric
- Add scoring logic in `src/domain/metrics/scoring.ts` using existing section/item pattern.
- Optionally add typed helper shape in `src/domain/metrics/types.ts`.

### Add a scoring rule / threshold
- Add thresholds in scoring profile logic and/or threshold utilities.
- If custom JSON-compatible, map key in parser and threshold resolver.

### Add an industry profile / heuristic
- Extend `INDUSTRY_PROFILES` and `GICS_INDUSTRIES` in `src/domain/industry/data.ts`.
- Optional helper usage in `src/domain/industry/heuristics.ts`.

### Add translation key / language
- Add key in language dictionaries.
- Add type-safe key support in `src/domain/i18n/keys.ts`.
- Update language selector in `AnalyzerPage` if adding a new language.

## 9) Troubleshooting
- **No table parsed**: ensure pasted content contains markdown rows beginning with `|` and includes date headers.
- **Custom profile error**: ensure JSON is valid object syntax.
- **Blank dashboard**: run `npm run typecheck` and check browser console for runtime issues.

## 10) Manual QA checklist
- [ ] Language switching updates UI and persists after refresh.
- [ ] Analyzer accepts a valid TIKR sample and renders dashboard.
- [ ] Section collapse/expand and “open/close all” work.
- [ ] Industry selector changes profile panel output.
- [ ] Custom JSON profile validates and affects thresholds.
- [ ] `fundamental-analyzer.html` redirects correctly.
