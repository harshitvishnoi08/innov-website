#!/usr/bin/env node
/**
 * Pulls Google Business Profile data: account/location info, performance
 * metrics (views, calls, direction requests, website clicks, bookings), and
 * reviews. Writes CSV reports to seo-tools/reports/gbp-*.csv, same pattern
 * as gsc.js.
 *
 * Usage: node gbp.js [days]   (default 30 days)
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { getAuthClient } = require('./gbp-auth');

const CRED_PATH = path.join(__dirname, 'gbp-oauth-credentials.json');
const TOKEN_PATH = path.join(__dirname, 'gbp-token.json');
const REPORTS_DIR = path.join(__dirname, 'reports');

const DAYS = parseInt(process.argv[2], 10) || 30;

const METRICS = [
  'BUSINESS_IMPRESSIONS_DESKTOP_MAPS',
  'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH',
  'BUSINESS_IMPRESSIONS_MOBILE_MAPS',
  'BUSINESS_IMPRESSIONS_MOBILE_SEARCH',
  'BUSINESS_CONVERSATIONS',
  'BUSINESS_DIRECTION_REQUESTS',
  'CALL_CLICKS',
  'WEBSITE_CLICKS',
  'BUSINESS_BOOKINGS',
  'BUSINESS_FOOD_ORDERS',
];

function toCsv(rows, headers) {
  const esc = (v) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(','), ...rows.map((r) => headers.map((h) => esc(r[h])).join(','))].join('\n');
}

function writeReport(name, rows, headers) {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const p = path.join(REPORTS_DIR, name);
  fs.writeFileSync(p, toCsv(rows, headers), 'utf8');
  console.log(`  ✓ ${name} (${rows.length} rows)`);
}

function dateRange(days) {
  const end = new Date();
  end.setDate(end.getDate() - 3); // GBP data also lags a few days
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return { start, end };
}

function ymd(d) {
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

async function main() {
  if (!fs.existsSync(CRED_PATH)) {
    console.error(`Missing ${CRED_PATH}. Download the OAuth client JSON and save it there.`);
    process.exit(1);
  }

  const auth = await getAuthClient({ credPath: CRED_PATH, tokenPath: TOKEN_PATH });

  console.log('Fetching accounts…');
  const accountMgmt = google.mybusinessaccountmanagement({ version: 'v1', auth });
  const { data: acctData } = await accountMgmt.accounts.list();
  const accounts = acctData.accounts || [];
  if (!accounts.length) {
    console.error('No Business Profile accounts found for this Google account.');
    process.exit(1);
  }
  accounts.forEach((a) => console.log(`  • ${a.accountName}  (${a.name})`));

  const account = accounts[0];
  console.log(`\nUsing account: ${account.accountName}\n`);

  console.log('Fetching locations…');
  const businessInfo = google.mybusinessbusinessinformation({ version: 'v1', auth });
  const { data: locData } = await businessInfo.accounts.locations.list({
    parent: account.name,
    readMask: 'name,title,storefrontAddress,metadata,phoneNumbers,websiteUri',
    pageSize: 100,
  });
  const locations = locData.locations || [];
  if (!locations.length) {
    console.error('No locations found under this account.');
    process.exit(1);
  }
  locations.forEach((l) => console.log(`  • ${l.title}  (${l.name})`));

  const location = locations[0];
  const locationId = location.name.split('/').pop();
  console.log(`\nUsing location: ${location.title}\n`);

  // ── Performance metrics ──────────────────────────────────────────
  console.log(`Fetching performance metrics (last ${DAYS} days)…`);
  const perf = google.businessprofileperformance({ version: 'v1', auth });
  const { start, end } = dateRange(DAYS);

  let dailyRows = [];
  try {
    const { data } = await perf.locations.fetchMultiDailyMetricsTimeSeries({
      location: `locations/${locationId}`,
      dailyMetrics: METRICS,
      'dailyRange.start_date.year': ymd(start).year,
      'dailyRange.start_date.month': ymd(start).month,
      'dailyRange.start_date.day': ymd(start).day,
      'dailyRange.end_date.year': ymd(end).year,
      'dailyRange.end_date.month': ymd(end).month,
      'dailyRange.end_date.day': ymd(end).day,
    });

    const byDate = {};
    for (const series of data.multiDailyMetricTimeSeries || []) {
      for (const dm of series.dailyMetricTimeSeries || []) {
        const metric = dm.dailyMetric;
        for (const dv of dm.timeSeries?.datedValues || []) {
          const d = dv.date;
          const key = `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
          byDate[key] = byDate[key] || { date: key };
          byDate[key][metric] = Number(dv.value || 0);
        }
      }
    }
    dailyRows = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
    writeReport('gbp-daily-metrics.csv', dailyRows, ['date', ...METRICS]);
  } catch (e) {
    console.error('  ✗ Could not fetch performance metrics:', e.message);
    console.error('    Make sure "Business Profile Performance API" is enabled for this project.');
  }

  // ── Reviews (legacy v4 API — may require separate access) ────────
  console.log('\nFetching reviews…');
  try {
    const token = await auth.getAccessToken();
    const resp = await fetch(
      `https://mybusiness.googleapis.com/v4/${account.name}/locations/${locationId}/reviews?pageSize=50`,
      { headers: { Authorization: `Bearer ${token.token || token}` } },
    );
    if (!resp.ok) {
      const body = await resp.text();
      throw new Error(`HTTP ${resp.status}: ${body.slice(0, 300)}`);
    }
    const data = await resp.json();
    const reviews = (data.reviews || []).map((r) => ({
      reviewer: r.reviewer?.displayName || '',
      rating: r.starRating || '',
      comment: r.comment || '',
      createTime: r.createTime || '',
      updateTime: r.updateTime || '',
      reply: r.reviewReply?.comment || '',
    }));
    writeReport('gbp-reviews.csv', reviews, ['reviewer', 'rating', 'comment', 'createTime', 'updateTime', 'reply']);
  } catch (e) {
    console.error('  ✗ Could not fetch reviews:', e.message);
    console.error('    Reviews are served by the legacy "My Business API v4", which Google');
    console.error('    restricts more tightly. If this keeps failing, we can read reviews via');
    console.error('    the Chrome browser tool instead — it doesn\'t need this API at all.');
  }

  console.log(`\n✓ Reports written to ${REPORTS_DIR}`);
}

main().catch((e) => {
  console.error('\nFailed:', e.message);
  if (e.response?.data) console.error(JSON.stringify(e.response.data, null, 2));
  process.exit(1);
});
