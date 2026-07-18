# SEO commands for weinnovarch.com

Custom Claude Code slash commands tailored to this **static HTML** site — no
WordPress, no Python, no paid APIs. They work on your real `.html` files and the
Google Search Console data pulled by `seo-tools/`.

This set covers the same ground as the open-source "SEO Machine" toolkit
(research → write → optimize → publish), rebuilt for a static site instead of
WordPress: there's no `/publish-draft` because there's no WordPress/Yoast to
push to — new pages are written directly as `.html` files and wired into
`blog.html`/`sitemap.xml` by `/seo-write` itself.

| Command | What it does |
|---|---|
| `/seo-refresh [days]` | Re-pull GSC data into `seo-tools/reports/` (default 28 days) |
| `/seo-opportunities [focus]` | Rank existing-page opportunities from GSC data → page + action |
| `/seo-priorities [focus]` | Same, but also considers genuine new-page gaps in one ranked list |
| `/seo-cluster <topic>` | Map a topic's pillar/supporting pages, find cannibalization + real gaps |
| `/seo-research <topic>` | Vet a new-page idea (checks it isn't already covered) and draft a brief |
| `/seo-write <topic/brief> <file>` | Write a brand-new page from a brief and wire it into blog/sitemap |
| `/seo-audit <page.html>` | Full on-page SEO audit of one page (findings only) |
| `/seo-optimize <page.html>` | Apply technical on-page fixes to a page (title/meta/schema/alt/links) |
| `/seo-rewrite <page.html>` | Deepen a page's content (new FAQ/section) for queries it ranks weakly on |
| `/seo-meta <page.html>` | Generate 5 title + 5 meta description options for a page |
| `/seo-scrub <page.html>` | Polish prose to sound less AI-generated (no fact/structure changes) |

**Typical loops:**
- *Fixing an existing page:* `/seo-refresh` → `/seo-opportunities` → pick a
  page → `/seo-audit` → `/seo-optimize` and/or `/seo-rewrite` → `/seo-scrub` →
  commit & deploy → re-check in ~2 weeks.
- *Building a new page:* `/seo-cluster <topic>` or `/seo-priorities` to find a
  genuine gap → `/seo-research <topic>` to confirm it's not already covered →
  `/seo-write` → `/seo-scrub` → commit & deploy.

**The one rule that matters most:** never create a new page without first
checking `seo-tools/reports/query-page.csv` for whether an existing page
already ranks for that query. `/seo-research`, `/seo-write`, `/seo-cluster` and
`/seo-priorities` all bake this check in — a duplicate page cannibalizes the
one that already exists instead of adding traffic.

House standard they all follow: `.claude/SEO-CONVENTIONS.md`.
