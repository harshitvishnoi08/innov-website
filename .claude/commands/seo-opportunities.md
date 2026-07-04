---
description: Rank the best SEO opportunities from GSC data and map each to a page/action
argument-hint: (optional) a focus, e.g. "noida" or "kitchen"
---

Turn the latest Search Console data into a prioritized action plan.
Optional focus filter: **$ARGUMENTS**

1. If `seo-tools/reports/` is missing or stale, tell the user to run
   `/seo-refresh` first. Otherwise read:
   - `opportunities.csv` (queries at pos 5–20 with impressions — page-2 pushes)
   - `quick-wins.csv` (good rank, low CTR — meta rewrites)
   - `query-page.csv`, `pages.csv`, `queries.csv` for context.
2. For each opportunity, map the GSC `page` URL to the local `.html` file
   (strip `https://weinnovarch.com/`). Confirm the file exists.
3. If a focus term was given ($ARGUMENTS), keep only matching queries/pages.

Score and rank opportunities by realistic upside — weigh **impressions**
(bigger = more traffic to gain), **position gap** (closer to page 1 = easier),
and **CTR gap** (well-ranked but low CTR = quick meta win). Group into:

- **🟢 Quick wins** — already top-10, low CTR → run `/seo-meta <file>`.
- **🟡 Page-2 pushes** — pos 5–20 with real impressions → run `/seo-optimize <file>`
  to deepen content / add FAQ targeting the exact query.
- **🔵 Content gaps** — queries with impressions but no strong matching page →
  candidate for a new page.

Output a single ranked table: `# | query | page(file) | impr | pos | CTR |
opportunity type | specific recommended action + command to run`. Then give a
short "do these 3 first" summary. This command only analyzes — it makes no edits.
