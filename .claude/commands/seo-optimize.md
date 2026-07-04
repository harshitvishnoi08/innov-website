---
description: Apply on-page SEO improvements to a static HTML page (edits the file)
argument-hint: <path-to-page.html>
---

Optimize the page **$ARGUMENTS** for search, then report what changed.

1. Read `.claude/SEO-CONVENTIONS.md` and the target file `$ARGUMENTS`.
2. Pull this page's real queries/positions from `seo-tools/reports/query-page.csv`
   (match on the canonical URL) so improvements target terms it can actually win.
3. Apply focused edits with the Edit tool, in priority order:
   - Fix the `<title>` and `<meta name="description">` if weak (see conventions).
   - Ensure canonical + OG/Twitter are complete, consistent, HTTPS/non-www.
   - Add or correct JSON-LD — especially **add FAQPage schema** when the page has
     a Q&A section, mirroring the visible questions/answers.
   - Fix heading hierarchy (single keyworded H1, clean H2/H3).
   - Add missing `alt` text to images.
   - Add 2–4 relevant internal links (services, contact, related pages) using the
     site's existing link style.
   - If a target query is under-served, add a short, accurate FAQ or paragraph
     that answers it in the searcher's words.

HARD RULES:
- **Never invent** prices, projects, awards, dates, or stats. If a fact is needed
  and unknown, insert a clearly-marked `<!-- TODO: confirm ... -->` and tell the
  user, rather than guessing.
- Only reference images that exist in `images/`. Verify before linking.
- Edit surgically — match the file's exact existing formatting/indentation and do
  not reflow or restructure unrelated markup.
- Preserve the brand voice (Ar. Udit Vishnoi — Innov Interiors & Architects).

Finish with: a bullet list of every change made, any `TODO` facts you need the
user to confirm, and a suggestion to re-run `/seo-audit $ARGUMENTS` to verify.
Remind the user changes are local until committed & deployed.
