---
description: Research a new topic/keyword before writing a page — checks for cannibalization, finds a template, drafts a brief
argument-hint: <topic or keyword>
---

Research **$ARGUMENTS** as a candidate for a brand-new page. Produce a brief only
— do NOT write or create any file in this step.

1. **Check it isn't already covered (do this first, always).** Grep
   `seo-tools/reports/query-page.csv` and `queries.csv` for the topic and its
   close variants. If an existing page already ranks for it — even weakly — this
   is a **page-2 push**, not a content gap: stop here, name the existing page,
   and recommend `/seo-optimize` or a targeted FAQ addition instead of a new
   page. Building a duplicate page on a topic Google already maps to one of your
   URLs will cannibalize it, not add traffic.
2. If genuinely uncovered, size the opportunity: pull every related query from
   `queries.csv` (plurals, "near me", city variants, misspellings) and sum
   impressions so the brief states a real, defensible volume estimate — not a
   guess.
3. Find the closest existing page to use as a template (same content type: cost
   guide, buyer's guide, location page, etc.) via `Glob`/`Grep` on similar
   existing `.html` files. Note its file path — `/seo-write` will need it.
4. Check `images/` for real assets this topic can reuse (hero + 1-2 inline
   images). Do not assume an image exists — list only verified paths.
5. Note 2-4 existing pages this new page should link to/from for internal
   linking (and which existing pages should later link back-in — flag them for
   an internal-link update, since `/seo-write` only edits the new file).

Output a short brief (not a file — print it in the response):
- **Verdict**: genuine gap or already covered (with the covering page if so).
- **Target queries** + summed impressions from GSC.
- **Template page** to model structure/CSS off.
- **Verified image assets** to reuse.
- **Internal link plan** (in and out).
- **Suggested file name and title** consistent with the site's existing naming
  pattern (`topic-city.html`, lowercase-hyphenated).

End by asking if the user wants to proceed to `/seo-write` with this brief.
