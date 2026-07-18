---
description: Deepen an existing page's content for queries it ranks weakly on (bigger than a meta tweak, short of a rewrite)
argument-hint: <path-to-page.html>
---

Deepen **$ARGUMENTS** for the real queries it ranks weakly on. This is content
expansion (new FAQ entries, a missing section, a data table) — for technical
on-page fixes (title/meta/schema/alt-text/canonical) use `/seo-optimize`
instead; for a from-scratch new page use `/seo-write`.

1. Read `.claude/SEO-CONVENTIONS.md` and the full target file.
2. Pull every query this page ranks for from `seo-tools/reports/query-page.csv`,
   sorted by impressions. Identify which real, exact-phrase queries the current
   content does **not** directly answer — these are the content gap, not
   generic "add more words."
3. For each under-served query, add either:
   - A new FAQ `<h3>` + answer (mirrored into the page's `FAQPage` JSON-LD), or
   - A short new section/table if the gap is structural (e.g. a missing cost
     tier, a missing city variant, a missing comparison).
4. Keep additions consistent with figures already stated elsewhere on the page
   and the site (don't introduce a new number that contradicts an existing
   one).
5. Validate the JSON-LD still parses after edits.

HARD RULES:
- **Never invent** prices, projects, awards, or stats.
- Edit surgically — insert new blocks, don't restructure or reflow existing
  content that already works.
- Preserve brand voice (Ar. Udit Vishnoi — Innov Architects & Interiors).

Finish with: a bullet list of what was added and which query each addition
targets, confirmation JSON-LD validated, and a reminder to re-check with
`/seo-refresh` in 10-14 days once Google reindexes.
