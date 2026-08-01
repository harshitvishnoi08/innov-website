/**
 * OAuth 2.0 authentication for the Google Business Profile APIs.
 *
 * First run: opens your browser, you sign in with the Google account that owns
 * the Business Profile listing, and a refresh token is saved to gbp-token.json.
 * Later runs: the saved token is reused (and silently refreshed) — no browser.
 */

const fs = require('fs');
const http = require('http');
const { URL } = require('url');
const { exec } = require('child_process');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/business.manage'];
const REDIRECT_PORT = 5859;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}`;

function loadClient(credPath) {
  const raw = JSON.parse(fs.readFileSync(credPath, 'utf8'));
  const cfg = raw.installed || raw.web || raw;
  if (!cfg.client_id || !cfg.client_secret) {
    throw new Error(`No client_id / client_secret found in ${credPath}.`);
  }
  return new google.auth.OAuth2(cfg.client_id, cfg.client_secret, REDIRECT_URI);
}

function openBrowser(url) {
  const cmd =
    process.platform === 'win32'
      ? `start "" "${url}"`
      : process.platform === 'darwin'
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

function interactiveAuth(oauth2) {
  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const u = new URL(req.url, REDIRECT_URI);
        const code = u.searchParams.get('code');
        const err = u.searchParams.get('error');
        if (err) {
          res.end(`Authorization failed: ${err}. You can close this tab.`);
          server.close();
          reject(new Error(`OAuth error: ${err}`));
          return;
        }
        if (!code) {
          res.end('Waiting for authorization…');
          return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.end('<h2>✓ Authorized.</h2><p>You can close this tab and return to the terminal.</p>');
        server.close();
        const { tokens } = await oauth2.getToken(code);
        resolve(tokens);
      } catch (e) {
        try { server.close(); } catch {}
        reject(e);
      }
    });

    server.on('error', reject);
    server.listen(REDIRECT_PORT, () => {
      console.log('\nA browser window will open for you to authorize access.');
      console.log('Sign in with the Google account that owns your Business Profile.');
      console.log('If it does not open automatically, use this URL:\n');
      console.log('  ' + authUrl + '\n');
      openBrowser(authUrl);
    });
  });
}

async function getAuthClient({ credPath, tokenPath }) {
  const oauth2 = loadClient(credPath);

  const persist = (tokens) =>
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2), 'utf8');

  if (fs.existsSync(tokenPath)) {
    const saved = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    oauth2.setCredentials(saved);
    oauth2.on('tokens', (t) => persist({ ...saved, ...t }));
    return oauth2;
  }

  const tokens = await interactiveAuth(oauth2);
  persist(tokens);
  oauth2.setCredentials(tokens);
  oauth2.on('tokens', (t) => persist({ ...tokens, ...t }));
  console.log(`✓ Authorized. Token saved to ${tokenPath} — future runs won't need the browser.\n`);
  return oauth2;
}

module.exports = { getAuthClient };
