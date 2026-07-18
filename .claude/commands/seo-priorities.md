---
description: One ranked roadmap across quick-wins, page-2 pushes, AND genuine new-page opportunities from GSC data
argument-hint: [optional focus, e.g. a city or topic]
---

Build one prioritized action roadmap for **$ARGUMENTS** (or the whole site if
no focus given). Analysis only — no file edits. This supersedes running
`/seo-opportunities` alone when the user also wants new-page candidates
considered in the same ranking.

1. If `seo-tools/reports/` is missing or stale (check file dates), tell the
   user to run `/seo-refresh` first.
2. Pull the standard existing-page opportunities exactly as `/seo-opportunities`
   does: quick wins (good rank, low CTR) and page-2 pushes (pos 5-20 with real
   impressions) from `opportunities.csv`/`quick-wins.csv`/`query-page.csv`.
3. Separately scan `queries.csv` for clusters of real impressions whose ranking
   page (per `query-page.csv`) is the **homepage**, a **location page** (e.g.
   `/noida/`), or **missing entirely** — these are the only valid new-page
   candidates. For each candidate, verify with a direct grep that no existing
   page already targets it before listing it as a gap (this exact mistake —
   recommending a "new page" for a query an existing page already owns — has
   happened on this site before; don't repeat it).
4. Score every item (existing-page fix or new-page candidate) on the same
   scale: impressions (bigger = more upside), position gap (closer to page 1 =
   easier), and effort (a meta rewrite < an FAQ addition < a brand-new page).

Output one ranked table: `# | opportunity | type (quick-win / page-2-push /
genuine gap) | page or proposed new page | impressions | position | effort |
command to run (/seo-meta, /seo-optimize, or /seo-research)`. Then give a "do
these 3 first" summary mixing both existing-page fixes and new-page ideas by
actual ROI, not by category.
