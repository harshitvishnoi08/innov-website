#!/usr/bin/env node
/**
 * Google Search Console performance puller for weinnovarch.com
 *
 * Usage:
 *   node gsc.js                 # last 28 days (config.defaultDays)
 *   node gsc.js 90              # last 90 days
 *   node gsc.js 2026-01-01 2026-06-30   # explicit start/end (YYYY-MM-DD)
 *
 * Requires a Google service-account JSON key (see README.md) saved as
 * ./service-account.json, and that service account added as a user on the
 * Search Console property.
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { getAuthClient } = require('./auth');

const ROOT = __dirname;
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));

// ── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(d) {
  return d.toISOString().slice(0, 10);
}

/** Resolve the reporting window from CLI args. */
function resolveDateRange(argv) {
  const args = argv.slice(2);
  const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);

  if (args.length >= 2 && isDate(args[0]) && isDate(args[1])) {
    return { startDate: args[0], endDate: args[1] };
  }

  // GSC data lags ~2-3 days, so end 3 days before today for complete data.
  const end = new Date();
  end.setDate(end.getDate() - 3);
  const days = args.length && Number.isFinite(+args[0]) ? +args[0] : CONFIG.defaultDays;
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  return { startDate: fmtDate(start), endDate: fmtDate(end) };
}

function csvEscape(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeCsv(file, headers, rows) {
  const lines = [headers.join(',')];
  for (const r of rows) lines.push(headers.map((h) => csvEscape(r[h])).join(','));
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
}

function pct(n) {
  return (n * 100).toFixed(1) + '%';
}

/** Pull all rows for a set of dimensions, paginating through the API. */
async function query(sc, siteUrl, body) {
  const rows = [];
  let startRow = 0;
  const limit = CONFIG.rowLimit;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await sc.searchanalytics.query({
      siteUrl,
      requestBody: { ...body, rowLimit: limit, startRow },
    });
    const batch = res.data.rows || [];
    rows.push(...batch);
    if (batch.length < limit) break;
    startRow += limit;
  }
  return rows;
}

/** Flatten API rows into plain objects keyed by dimension names. */
function shape(rows, dims) {
  return rows.map((r) => {
    const o = {};
    dims.forEach((d, i) => (o[d] = r.keys[i]));
    o.clicks = r.clicks;
    o.impressions = r.impressions;
    o.ctr = r.ctr;
    o.position = r.position;
    return o;
  });
}

function toCsvRow(o) {
  return {
    ...o,
    ctr: pct(o.ctr),
    position: o.position.toFixed(1),
    clicks: Math.round(o.clicks),
    impressions: Math.round(o.impressions),
  };
}

/** Pretty console table of the top N rows. */
function printTable(title, rows, labelKey, n = 10) {
  console.log('\n' + title);
  console.log('─'.repeat(title.length));
  if (!rows.length) {
    console.log('  (no data)');
    return;
  }
  const top = rows.slice(0, n);
  const labelW = Math.min(52, Math.max(...top.map((r) => String(r[labelKey]).length), labelKey.length));
  const head =
    labelKey.padEnd(labelW) +
    '  ' + 'clicks'.padStart(7) +
    '  ' + 'impr'.padStart(8) +
    '  ' + 'ctr'.padStart(6) +
    '  ' + 'pos'.padStart(5);
  console.log(head);
  for (const r of top) {
    const label = String(r[labelKey]);
    const shown = label.length > labelW ? label.slice(0, labelW - 1) + '…' : label.padEnd(labelW);
    console.log(
      shown +
        '  ' + String(Math.round(r.clicks)).padStart(7) +
        '  ' + String(Math.round(r.impressions)).padStart(8) +
        '  ' + pct(r.ctr).padStart(6) +
        '  ' + r.position.toFixed(1).padStart(5),
    );
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const credPath = path.join(ROOT, CONFIG.oauthCredentials);
  if (!fs.existsSync(credPath)) {
    console.error(
      `\n✗ OAuth credentials not found at:\n    ${credPath}\n\n` +
        `In Google Cloud Console (see README.md, Part A): configure the OAuth\n` +
        `consent screen, create an OAuth Client ID of type "Desktop app",\n` +
        `download its JSON, and save it as "${CONFIG.oauthCredentials}" in this folder.\n`,
    );
    process.exit(1);
  }

  const { startDate, endDate } = resolveDateRange(process.argv);
  const siteUrl = CONFIG.siteUrl;
  const outDir = path.join(ROOT, CONFIG.outputDir);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`\nGoogle Search Console — ${siteUrl}`);
  console.log(`Window: ${startDate} → ${endDate}`);

  const auth = await getAuthClient({
    credPath,
    tokenPath: path.join(ROOT, CONFIG.tokenFile),
  });
  const sc = google.searchconsole({ version: 'v1', auth });

  let queries, pages, queryPage, dates;
  try {
    [queries, pages, queryPage, dates] = await Promise.all([
      query(sc, siteUrl, { startDate, endDate, dimensions: ['query'] }),
      query(sc, siteUrl, { startDate, endDate, dimensions: ['page'] }),
      query(sc, siteUrl, { startDate, endDate, dimensions: ['query', 'page'] }),
      query(sc, siteUrl, { startDate, endDate, dimensions: ['date'] }),
    ]);
  } catch (err) {
    const msg = err?.errors?.[0]?.message || err.message || String(err);
    console.error(`\n✗ Search Console API error: ${msg}`);
    if (/permission|forbidden|does not have/i.test(msg)) {
      console.error(
        `\nThe signed-in Google account may not have access to this property.\n` +
          `Make sure you authorized with the account that owns\n` +
          `${siteUrl} in Search Console. To re-authorize with a different\n` +
          `account, delete ${CONFIG.tokenFile} and run again.\n`,
      );
    }
    process.exit(1);
  }

  const q = shape(queries, ['query']).sort((a, b) => b.clicks - a.clicks);
  const p = shape(pages, ['page']).sort((a, b) => b.clicks - a.clicks);
  const qp = shape(queryPage, ['query', 'page']).sort((a, b) => b.impressions - a.impressions);
  const d = shape(dates, ['date']).sort((a, b) => a.date.localeCompare(b.date));

  // Opportunities: queries on page 2-ish (real ranking, close to page 1).
  const opp = CONFIG.opportunity;
  const opportunities = qp
    .filter(
      (r) =>
        r.position >= opp.minPosition &&
        r.position <= opp.maxPosition &&
        r.impressions >= opp.minImpressions,
    )
    .sort((a, b) => b.impressions - a.impressions);

  // Quick wins: ranking well but low CTR → improve title/meta to earn clicks.
  const qw = CONFIG.quickWin;
  const quickWins = qp
    .filter(
      (r) =>
        r.position >= qw.minPosition &&
        r.position <= qw.maxPosition &&
        r.ctr <= qw.maxCtr &&
        r.impressions >= qw.minImpressions,
    )
    .sort((a, b) => b.impressions - a.impressions);

  // ── Write CSVs ──
  writeCsv(path.join(outDir, 'queries.csv'), ['query', 'clicks', 'impressions', 'ctr', 'position'], q.map(toCsvRow));
  writeCsv(path.join(outDir, 'pages.csv'), ['page', 'clicks', 'impressions', 'ctr', 'position'], p.map(toCsvRow));
  writeCsv(path.join(outDir, 'query-page.csv'), ['query', 'page', 'clicks', 'impressions', 'ctr', 'position'], qp.map(toCsvRow));
  writeCsv(path.join(outDir, 'daily-trend.csv'), ['date', 'clicks', 'impressions', 'ctr', 'position'], d.map(toCsvRow));
  writeCsv(path.join(outDir, 'opportunities.csv'), ['query', 'page', 'clicks', 'impressions', 'ctr', 'position'], opportunities.map(toCsvRow));
  writeCsv(path.join(outDir, 'quick-wins.csv'), ['query', 'page', 'clicks', 'impressions', 'ctr', 'position'], quickWins.map(toCsvRow));

  // ── Console summary ──
  const totals = q.reduce(
    (a, r) => ({ clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions }),
    { clicks: 0, impressions: 0 },
  );
  const avgPos = p.length ? p.reduce((a, r) => a + r.position * r.impressions, 0) / (p.reduce((a, r) => a + r.impressions, 0) || 1) : 0;

  console.log('SUMMARY');
  console.log('───────');
  console.log(`  Clicks:        ${Math.round(totals.clicks).toLocaleString()}`);
  console.log(`  Impressions:   ${Math.round(totals.impressions).toLocaleString()}`);
  console.log(`  Avg CTR:       ${pct(totals.clicks / (totals.impressions || 1))}`);
  console.log(`  Avg position:  ${avgPos.toFixed(1)} (impression-weighted)`);
  console.log(`  Unique queries: ${q.length.toLocaleString()}   Unique pages: ${p.length.toLocaleString()}`);

  printTable('TOP QUERIES (by clicks)', q, 'query', 10);
  printTable('TOP PAGES (by clicks)', p, 'page', 10);
  printTable(`OPPORTUNITIES — pos ${opp.minPosition}-${opp.maxPosition}, ≥${opp.minImpressions} impr (push to page 1)`, opportunities, 'query', 15);
  printTable(`QUICK WINS — good rank, low CTR (fix title/meta)`, quickWins, 'query', 10);

  console.log(`\n✓ ${6} CSV reports written to  ${outDir}\n`);
  console.log('   queries.csv · pages.csv · query-page.csv · daily-trend.csv · opportunities.csv · quick-wins.csv\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
