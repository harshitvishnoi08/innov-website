# SEO commands for weinnovarch.com

Custom Claude Code slash commands tailored to this **static HTML** site — no
WordPress, no Python, no paid APIs. They work on your real `.html` files and the
Google Search Console data pulled by `seo-tools/`.

| Command | What it does |
|---|---|
| `/seo-refresh [days]` | Re-pull GSC data into `seo-tools/reports/` (default 28 days) |
| `/seo-opportunities [focus]` | Rank the best opportunities from GSC data → page + action |
| `/seo-audit <page.html>` | Full on-page SEO audit of one page (findings only) |
| `/seo-optimize <page.html>` | Apply on-page fixes to a page (edits the file) |
| `/seo-meta <page.html>` | Generate 5 title + 5 meta description options for a page |

**Typical loop:** `/seo-refresh` → `/seo-opportunities` → pick a page →
`/seo-audit` it → `/seo-optimize` (or `/seo-meta`) → commit & deploy → re-check
in ~2 weeks.

House standard they all follow: `.claude/SEO-CONVENTIONS.md`.
