/*
 * Ad attribution capture — stores gclid + utm_* from the landing URL in a
 * first-party cookie so submit.php can forward them to the CRM with the
 * enquiry. Runs on every page; only writes when the URL actually carries
 * params, so a visitor who lands from an ad and submits from another page
 * days later is still attributed. 90-day expiry matches Google's click window.
 */
(function () {
  try {
    var params = new URLSearchParams(window.location.search);
    var keys = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    var attr = {};
    var found = false;
    for (var i = 0; i < keys.length; i++) {
      var v = params.get(keys[i]);
      if (v) { attr[keys[i]] = v.slice(0, 200); found = true; }
    }
    if (!found) return;

    attr.landing_page = window.location.href.slice(0, 1000);
    attr.referrer = (document.referrer || '').slice(0, 1000);
    attr.captured_at = new Date().toISOString();

    var expires = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = 'innov_attr=' + encodeURIComponent(JSON.stringify(attr)) +
      '; expires=' + expires + '; path=/; SameSite=Lax' +
      (location.protocol === 'https:' ? '; Secure' : '');
  } catch (e) { /* never break the page over analytics */ }
})();
