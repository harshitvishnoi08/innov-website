---
description: Map a topic cluster — pillar page, supporting pages, and real gaps — from existing site content + GSC data
argument-hint: <topic, e.g. "office interior design">
---

Map the topic cluster for **$ARGUMENTS**. Analysis only — no file edits.

1. `Glob`/`Grep` existing `.html` pages whose title, filename or content relate
   to the topic. List every page found with its current `<title>`.
2. For each page, pull its real queries/impressions/position from
   `seo-tools/reports/query-page.csv` so the cluster map is grounded in actual
   search performance, not guesswork.
3. Identify the **pillar** (the broadest, highest-authority page on the topic —
   usually the one with the most impressions or the most general title) and
   the **supporting pages** (narrower variants: by city, by BHK size, by
   budget tier, etc.).
4. Flag any **cannibalization**: two+ pages both getting impressions for the
   same or near-identical query, or a query landing on the homepage/a location
   page instead of the topically-correct page (this has happened on this site
   before — e.g. "architects in Noida" leaking to the homepage instead of
   `/noida/`). Recommend which page should own the query and what to
   strengthen there.
5. Identify **genuine gaps** — real query volume in `queries.csv` with no page
   in the cluster covering it at all (verify via `query-page.csv`, not
   assumption).

Output a cluster map:
- **Pillar**: page + why.
- **Supporting pages**: list with their query coverage.
- **Cannibalization found**: pairs of pages/queries competing, with a fix
  recommendation (`/seo-optimize` the correct page, don't touch the other).
- **Genuine gaps**: candidate new pages, each with summed impressions — hand
  these to `/seo-research` before writing anything.
