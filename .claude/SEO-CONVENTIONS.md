# Innov Architects — House SEO Conventions

The standard every page on weinnovarch.com follows. The `/seo-*` commands audit
and optimize against this. Derived from the site's existing well-built pages
(e.g. `modular-kitchen-cost-noida.html`).

## Canonical / host rules
- Canonical host is **`https://weinnovarch.com`** — always **HTTPS, non-www**.
- Every page has `<link rel="canonical" href="https://weinnovarch.com/<path>">`
  pointing to its own absolute URL.
- Absolute URLs in `og:url`, `og:image`, JSON-LD, sitemaps all use the same host.

## `<head>` checklist (per page)
- `<html lang="en">`, `<meta charset="utf-8">`, responsive `<meta name="viewport">`.
- **`<title>`** — target ~50–60 chars (~600px). Front-load the primary keyword;
  end with the brand suffix `| Innov Architects`. Include the year for
  cost/price/trend pages (they refresh annually).
- **`<meta name="description">`** — 140–160 chars, compelling, includes the
  primary keyword + location (Noida / Delhi NCR) and a reason to click.
- `<meta name="keywords">` — kept for consistency (low ranking value; don't stuff).
- **Open Graph** — `og:title`, `og:description`, `og:type` (`article` for guides),
  `og:image` (absolute .webp URL that **must exist** in `images/`), `og:url`.
- **Twitter** — `twitter:card=summary_large_image`, `twitter:title/description/image`.
- **Favicon** — `images/circle-logo.png`.
- **GA4** — the `G-N3DFG47HWK` gtag snippet is present.

## Structured data (JSON-LD)
- Cost/guide/how-to articles → `@type: Article` (headline, description, image,
  author `Ar. Udit Vishnoi`, datePublished).
- Pages with a Q&A section → **add `@type: FAQPage`** (huge win for the
  question-style queries these pages target — enables rich results).
- Location landing pages (`/noida/`, `/delhi/`) → consider
  `LocalBusiness` / `Service` schema.
- JSON-LD `headline`/`description` should match the visible `<title>`/H1 intent.

## On-page body
- Exactly **one `<h1>`**, containing the primary keyword; logical H2→H3 nesting,
  no skipped levels.
- Every `<img>` has descriptive **`alt`** text (and `loading="lazy"` below the fold).
- **Internal links**: each page links to relevant money pages
  (`services.html`, `contact.html`) and 2–4 topically related pages
  (e.g. a kitchen-cost page links to interior-design and renovation-cost pages).
- Answer the **actual search queries** the page ranks for (see GSC data) in the
  copy — ideally with a matching FAQ block.
- Cost pages: include concrete India-market numbers, tables, and a clear CTA.

## Brand / accuracy guardrails
- Author/brand voice: **Ar. Udit Vishnoi — Innov Interiors & Architects**.
- Never invent prices, projects, awards, or stats. Keep claims consistent with
  what's already on the site. Edit surgically — don't reflow unrelated markup.

## Data sources for decisions
- GSC performance CSVs live in **`seo-tools/reports/`** (regenerate with
  `/seo-refresh`). `query-page.csv` maps which queries each page ranks for;
  `opportunities.csv` and `quick-wins.csv` are pre-filtered action lists.
