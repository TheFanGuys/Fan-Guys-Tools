# Fan Guys Tools — current audit and redesign status

## Scope
Inspected Home, Survey, Estimate, Layout, Materials, Tech Pro, shared project storage, backup/restore, and offline shell. This is a static, no-build GitHub Pages app. The V2 namespace remains enabled for separate-folder testing.

## Findings by tool
- **Home:** project switching and backup are central. The former backup could silently omit a referenced Layout photo. Backup now rejects an incomplete photo set. The launcher link and explicit “‹ Tools” return label are restored. A V2 test restore from a live-format backup with photo bytes passes in the source harness.
- **Survey:** its long field list still needs field use on iPhone to judge speed. Unknown answers remain unknown; clearance cannot pass on an unset height. The longer-downtube warning was corrected. Breaker tally is planning only and not verified.
- **Estimate:** missing labor rates are flagged per selected model; saved overrides survive reconstruction. Mixed install quantities and misc costs are exercised in source tests. The screen now starts with scope, then direct costs, then travel and review. City lookup is an allowance aid, not a live quote.
- **Layout:** source tests cover placement, scale calibration, pinch, undo, layer visibility/selectability, SVG export, routing, and photo undo. Standalone restore now preserves colliding plan names. This does not establish accuracy of every drawing interaction on real iOS touch hardware or a large imported PDF/photo.
- **Materials:** catalog units, dependent nuts, manual overrides, export and PDF payload have tests. Custom names and print titles are escaped. The mobile field list still merits a real job trial.
- **Tech Pro:** voltage-drop math was corrected for three-phase and operating-temperature conductor resistance. Reference motor data and manufacturer wiring/parameter advice have not been independently certified against every current manual. The generic faux Fan Guys header has been replaced with the bundled brand mark.

## Visual redesign in this package
Graphite, cool steel and orange across all six screens; an actual desktop tool rail and compact tablet rail; a one-thumb bottom tool menu on phone; new Estimate stage composition, Survey entry grid, branded Tech Pro, stronger Home and Materials hierarchy. Layout keeps a full drawing canvas. This is a significant interface pass, not a claim that every complex screen has been rebuilt from scratch.

## Verification
Run from the package root: `node verification/layout-engine.test.cjs`, `node verification/estimate-engine.test.cjs`, `node verification/materials-engine.test.cjs`, `node verification/survey-engine.test.cjs`, and `node verification/v2-migration.test.cjs`. All passed in this workspace (26 Layout, 9 Estimate, 8 Materials, 8 Survey, 2 migration). JavaScript syntax checks passed. Previewed Estimate, Survey, Layout, and Tech Pro on a desktop browser. Actual iPhone/iPad Safari, offline cold launch, camera/photo import, share-sheet PDF behavior, and full manufacturer specification audit remain acceptance work.

## Data and release guardrails
V2 localStorage and IndexedDB are isolated; old live keys are not altered by opening V2. A live-format backup is imported into V2 as a copy. The service worker uses a relative folder scope and cache `fanguys-field-v2-15`. Test in `/Fan-Guys-Tools-V2/` before replacing live. Back up live data first, including photos; do not clear website data to force an update.
