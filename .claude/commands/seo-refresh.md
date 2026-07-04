---
description: Re-pull the latest Google Search Console data into seo-tools/reports
argument-hint: (optional) number of days, e.g. 90
---

Refresh the Search Console performance reports.

1. Run the puller from the `seo-tools` folder. If a day count was given
   ($ARGUMENTS), pass it; otherwise use the default 28-day window:
   - `cd seo-tools && npm run gsc` (or `node gsc.js $ARGUMENTS` when days given).
2. This regenerates the CSVs in `seo-tools/reports/` (queries, pages,
   query-page, daily-trend, opportunities, quick-wins).
3. If it fails because `oauth-credentials.json` or `token.json` is missing, point
   the user to `seo-tools/README.md` (Part A). The first-ever run opens a browser
   to authorize; later runs are silent.
4. After it succeeds, summarize the headline numbers (clicks, impressions, CTR,
   avg position) and suggest running `/seo-opportunities` to plan next actions.
