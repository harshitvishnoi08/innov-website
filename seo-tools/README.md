# SEO Tools — Google Search Console puller

Pulls performance data for **weinnovarch.com** (Domain property
`sc-domain:weinnovarch.com`) from the Google Search Console API and writes
SEO reports you can act on.

## What you get

Running `npm run gsc` prints a summary + top tables to the terminal **and**
writes six CSV files to `reports/`:

| File | What's in it |
|------|--------------|
| `queries.csv` | Every search query — clicks, impressions, CTR, avg position |
| `pages.csv` | Every landing page — same metrics |
| `query-page.csv` | Query × page combinations |
| `daily-trend.csv` | Day-by-day clicks/impressions/CTR/position |
| `opportunities.csv` | Queries ranking **positions 5–20** with real impressions — push these to page 1 |
| `quick-wins.csv` | Good rank (top 10) but **low CTR** — rewrite the page title / meta description to earn more clicks |

---

## One-time setup

### Part A — Google Cloud (do this in your browser)

Authentication uses **OAuth 2.0** — you sign in as yourself (the Google account
that already owns the Search Console property), so there's **no user to add** in
Search Console.

1. **Google Cloud Console** → https://console.cloud.google.com/ → create a
   project (e.g. `innovarch-seo`).
2. **APIs & Services → Library** → search **"Google Search Console API"** →
   **Enable**.
3. **APIs & Services → OAuth consent screen** → choose **External** → fill in the
   app name (e.g. `Innovarch SEO`) and your support email → Save.
   - Under **Audience / Test users**, add your own Google account email
     (`support@weinnovarch.com`). While the app is in "Testing" mode only
     listed test users can authorize — that's fine for personal use.
   - You do **not** need to submit the app for verification.
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID** →
   Application type **Desktop app** → Create.
5. Click **Download JSON** on the client you just made. Save it **in this
   folder** as **`oauth-credentials.json`**.

That's it — no Search Console changes needed.

> 🔒 `oauth-credentials.json` and the `token.json` created on first run are
> secrets. Both are git-ignored so they'll never be committed or deployed.
> Never share them.

### Part B — install dependencies (one command)

```bash
cd seo-tools
npm install
```

---

## Usage

```bash
npm run gsc                      # last 28 days
node gsc.js 90                   # last 90 days
node gsc.js 2026-01-01 2026-06-30   # explicit date range (YYYY-MM-DD)
```

**The first run** opens your browser to sign in and authorize (pick the account
that owns the property, click through the "unverified app" screen → Continue).
A `token.json` is then saved, so **later runs need no browser**.

To re-authorize with a different Google account, delete `token.json` and run
again.

Open the CSVs in `reports/` with Excel / Google Sheets, or read the terminal
summary for a quick view.

## Tuning

Thresholds for the "opportunities" and "quick-wins" reports live in
`config.json` — adjust `minPosition`, `maxPosition`, `minImpressions`, etc.
to taste.

## How to act on the data

- **opportunities.csv** → these queries already rank on page 2. Strengthen the
  matching page (add content, headings, internal links targeting that query) to
  move it onto page 1.
- **quick-wins.csv** → you already rank top-10 but few people click. Rewrite the
  `<title>` and `<meta name="description">` of that page to be more compelling.
- **pages.csv / queries.csv** → find your best performers and double down;
  spot pages with impressions but ~0 clicks that need work.
- **daily-trend.csv** → watch for drops (algorithm updates, technical issues)
  or lifts after you ship changes.
