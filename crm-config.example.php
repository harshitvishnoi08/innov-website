<?php
// Copy to crm-config.php on the server (cPanel File Manager, public_html/),
// fill in real values, chmod 640. crm-config.php is gitignored — never commit it.
return [
    // CRM endpoint + the same secret set as WEBSITE_FORM_SECRET in the CRM
    'crm_url'    => 'https://<crm-domain>/api/webhook/website',
    'crm_secret' => '',

    // SMTP for the enquiry notification email
    'smtp_host'  => 'mail.weinnovarch.com',
    'smtp_port'  => 465,
    'smtp_user'  => 'contact@weinnovarch.com',
    'smtp_pass'  => '',
];
