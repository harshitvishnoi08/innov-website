---
description: Audit on-page SEO of a static HTML page against house conventions + GSC data
argument-hint: <path-to-page.html>
---

You are doing an on-page SEO audit of the page: **$ARGUMENTS**

Steps:
1. Read `.claude/SEO-CONVENTIONS.md` for the house standard.
2. Read the target file `$ARGUMENTS` in full.
3. If `seo-tools/reports/query-page.csv` exists, find the rows whose `page`
   matches this page's canonical URL (strip `https://weinnovarch.com/` to map to
   the file). Note the real queries it earns impressions for, its positions, and
   CTR — the audit must check the page actually satisfies those queries.

Then produce a findings report, NOT edits. For each area give a status
(✅ good / ⚠️ improve / ❌ missing) with the specific problem and fix:

- **Title** — length (target ~50–60 chars / ~600px), primary keyword front-loaded, brand suffix, year if a cost/trend page.
- **Meta description** — 140–160 chars, keyword + location, compelling.
- **Canonical** — present, HTTPS + non-www, self-referential, correct path.
- **Open Graph / Twitter** — complete and consistent; verify `og:image` /
  `twitter:image` files actually exist in `images/` (check the filesystem).
- **Structured data** — JSON-LD present & appropriate `@type`; flag missing
  **FAQPage** schema if the page has (or should have) a Q&A section.
- **Headings** — exactly one H1 with the keyword; clean H2→H3 hierarchy.
- **Image alt text** — list any `<img>` missing/weak `alt`.
- **Internal links** — does it link to services/contact + 2–4 related pages?
- **Query coverage** — for each GSC query above, is it genuinely addressed in the
  body? Call out gaps (e.g. ranks pos 12 for "modular kitchen price in noida"
  but never uses that phrasing or answers the price question directly).
- **Content depth / CTA** — length vs intent, concrete numbers/tables, clear CTA.

End with a **prioritized fix list** (highest SEO impact first) and the exact
`/seo-optimize $ARGUMENTS` or `/seo-meta $ARGUMENTS` follow-up to run. Do not
modify the file in this command.
