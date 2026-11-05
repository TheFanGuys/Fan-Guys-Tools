# Fan Guys Tools

One app for the job: Site Survey, Estimate, Layout, Materials and Tech Pro. Add it to your iPhone home screen once and every tool shares the same saved data.

**Open it:** https://thefanguys.github.io/Fan-Guys-Tools/

## How it works

- **Current job:** set it on the home screen. Survey, Estimate and Materials fill in the job name and address when their fields are empty.
- **Tools:** tap a tile to open it. The orange **‹ Tools** button in each tool brings you back home; drag it if it's in the way.
- **From the launcher:** if you opened Tools from the Fan Guys launcher page, a **‹ All Fan Guys apps** link at the top takes you back to it.
- **Labor rates:** gear icon → Labor rates. Stored on your phone only, never in this code. Until they're set, Estimate shows $0 labor and a reminder bar.
- **Backup:** gear icon → Back up saves jobs, rates and every tool's saved work in one file. Layout photos aren't included.

Fan Guys Books (invoices and ledger) stays its own app.

## Not done yet

- Each tool still holds one job's work at a time. Switching the current job doesn't swap what's saved inside the tools.
- Layout keeps its own job list, and its photos aren't in the backup.
- The tools keep their original looks inside.

## Files

- `index.html` is the home screen
- `survey/`, `estimate/`, `layout/`, `materials/`, `tech/` are the tools
- `shared/fgt.js` is the ‹ Tools button, job fill-in and labor rates
- `shared/mark.png` and `icon-*.png` are the app icons

No build step. Hosted on GitHub Pages.
