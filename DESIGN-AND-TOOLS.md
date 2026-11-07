# Field design and zero-cost tools

This version keeps static files on GitHub Pages, with no server, build step, account, paid license, hosting subscription or monthly service. The visual guides are inline SVG. The Field List uses bundled local drawings instead of remote thumbnail photos, so categories remain recognizable offline.

## Changes in this package

- `materials/index.html`: redesigned category browsing, local icons, search, item count, three-step illustrated guide, editable collapsed job details and accessible quantity labels. Clearing materials leaves the job fields intact. Preview and export colors follow the shared palette.
- `shared/materials.css`: phone, tablet and desktop layouts, light and dark contrast, touch targets and category treatment.
- `shared/workspace.js` and `shared/workspace.css`: three-step visual help inside Survey, Estimate, Layout, Materials and Tech Pro. The help is available from `?` in tool headers or Tools in Layout. Navigation from the previous revision remains.
- `index.html` and `shared/home.css`: use the bundled Fan Guys Tools badge in desktop and mobile Home branding.
- `sw.js`: cache version `fanguys-field-v2-8` and `shared/materials.css` in the offline pack.

No material names, item keys, saved-data format, storage namespace, layout geometry or engineering formulas were changed. V2 remains isolated with `RELEASE_NAMESPACE='v2:'` in `shared/store.js`.

## Real tools worth using

| Tool | What it would do here | Cost and fit | Decision |
| --- | --- | --- | --- |
| [PDF.js](https://mozilla.github.io/pdf.js/getting_started/) | Render a PDF floor-plan page on the phone before calibration | Apache 2.0, self-hosted; already bundled in Layout | Keep and improve the current import flow. |
| [JSZip](https://github.com/Stuk/jszip) | Package the full backup and photos as one compressed ZIP, especially for large Layout jobs | MIT option, self-hosted, no account | Worth a separate, tested backup-format project; do not change restores casually. |
| [OpenSeadragon](https://openseadragon.github.io/) | Smooth zooming for exceptionally large floor-plan images | BSD license, self-hosted, no service | Only if real iPad/iPhone tests show the current Layout zoom cannot handle large plans. It does not draw walls or fans. |
| [LibreCAD](https://librecad.org/) | Create or clean up precise 2D drawings on a desktop, then export PDF for Layout | Free GPL desktop program | Useful companion, not an iPhone app or embedded plugin. |

I would not replace the existing Layout engine with a canvas framework just for its name. The existing engine already handles fan placement, layers, calibration, routing, Undo and iPhone gestures, and a rewrite risks saved work. Map outlines also cannot supply warehouse interior columns, racks or mounting heights. The useful next step is better PDF/photo alignment and measurement verification on an actual iPhone.

## Acceptance on an iPhone and iPad

1. Open V2 online, then Airplane Mode. Reload Home, Field List and Layout. Pass: pages and Field List icons render without a connection.
2. Enter EMT and flex quantities; switch to Counted items, preview and save/share a PDF. Pass: sticks and feet remain correct and counted items survive a reload.
3. Open the `?` help on Survey, Estimate, Materials and Tech Pro, and open Tools → How to use Layout. Pass: diagrams are legible and close without losing work.
4. On iPad, rotate portrait/landscape and use category search, the project switcher and Layout dock. Pass: no controls are hidden or overlapping.
5. Make a full backup with photos before replacing any live files. Pass: restore into a fresh V2 copy and open the photos.

Browser layout and source tests are useful checks, but they do not prove Safari share-sheet, storage eviction, orientation or offline cold-start behavior on physical iOS hardware.
