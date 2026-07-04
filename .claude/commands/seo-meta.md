---
description: Generate optimized <title> + meta description variations for a page
argument-hint: <path-to-page.html>
---

Generate better title tags and meta descriptions for **$ARGUMENTS**.

1. Read `.claude/SEO-CONVENTIONS.md` and the target file's current `<head>`.
2. From `seo-tools/reports/query-page.csv` (and `quick-wins.csv`), get the real
   queries this page ranks for and its CTR — the goal is higher CTR on terms it
   already gets impressions for.

Then output (do NOT edit the file yet):
- The **current** title + meta description with their character/approx-pixel
  widths, and what's weak about them.
- **5 `<title>` options** — each ~50–60 chars (~600px), primary keyword
  front-loaded, brand suffix, year where relevant. Show char count per option.
- **5 `<meta description>` options** — each 140–160 chars, keyword + location +
  a click reason (numbers, "2026", "award-winning studio", clear benefit).
- A tiny **Google SERP preview** (mono block) for your #1 recommended pairing.
- Your **recommended** title + description and why (tie it to the GSC queries).

End by offering to apply the recommended pair via Edit if the user approves.
Never fabricate claims; keep everything truthful to the page's actual content.
