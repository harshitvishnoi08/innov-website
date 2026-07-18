---
description: Write a brand-new SEO page from a brief (or topic), matching site template/conventions, and wire it in
argument-hint: <topic or brief> <new-file-name.html>
---

Write a new page for **$ARGUMENTS**. If `/seo-research` wasn't already run for
this topic in this conversation, run its cannibalization check first (step 1
below) before writing anything — never skip straight to a new file.

1. **Cannibalization check.** Grep `seo-tools/reports/query-page.csv` and
   `queries.csv` for the topic. If an existing page already ranks for it, stop
   and say so — recommend `/seo-optimize` or a content addition to that page
   instead. Do not create a page that competes with one that already exists.
2. Read `.claude/SEO-CONVENTIONS.md` and the closest existing template page in
   full (same content type — cost guide, buyer's guide, location page) to copy
   its exact CSS/structure/schema pattern. Consistency with the rest of the
   site matters more than novelty here.
3. Write the new `.html` file with:
   - Full `<head>` per conventions: title (~50-60 chars), meta description
     (140-160 chars), OG/Twitter, canonical, GA4 snippet, favicon.
   - `Article` JSON-LD (and `FAQPage` JSON-LD if the page has a Q&A section —
     it should).
   - One keyworded `<h1>`, logical H2/H3 structure, a cost/data table if the
     topic is cost-related, and a 4-6 question FAQ block matching the exact
     phrasing of the real queries from the brief.
   - Internal links to 2-4 related existing pages, using the site's existing
     anchor-text style.
   - Only images verified to exist in `images/`.
4. Wire the new page in:
   - Add a card to `blog.html` matching the existing `.blog-card` markup.
   - Add a `<url>` entry to `sitemap.xml`.
   - Add a cross-link from the closest related existing page(s) back to the
     new page (small, surgical edit — don't reflow their layout).
5. Validate every JSON-LD block parses (`node -e` JSON.parse check) before
   finishing.

HARD RULES:
- **Never invent** prices, projects, awards, dates, or stats — reuse figures
  already established elsewhere on the site (e.g. construction cost bands,
  FOAID 2025 award, 500+ projects) rather than making up new ones.
- Brand voice: Ar. Udit Vishnoi — Innov Architects & Interiors.
- Don't touch unrelated pages beyond the small cross-link additions in step 4.

Finish with: the new file path, a summary of what was added and where it links,
confirmation the JSON-LD validated, and a reminder that this is all local until
committed and pushed.
