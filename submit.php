<?php
if (isset($_POST['submit'])) {
    $name        = $_POST['Name'];
    $mobile      = $_POST['Number'] ?? '';
    $email       = $_POST['Email'];
    $city        = $_POST['City'];
    $requirement = $_POST['Requirement'] ?? '';
    $budget      = $_POST['Budget'] ?? '';
    $landArea    = $_POST['LandArea'] ?? '';
    $message     = $_POST['message'] ?? '';
    $ip          = $_SERVER['REMOTE_ADDR'];

    // --- Email Notification ---
    $to = [
        "support@weinnovarch.com",
        "vishnoih10@gmail.com",
        "uditvishnoi@weinnovarch.com",
        "umang.arora@weinnovarch.com",
        "support@weinnovarch.com"
    ];

    $subject = "New Lead: " . $name . " | " . $requirement;

    $mobileDigits = preg_replace('/[^0-9]/', '', $mobile);
    $waText = rawurlencode("Hi " . $name . ", this is Innov Interiors & Architects. We received your enquiry for " . $requirement . ". Are you available for a quick call?");

    $htmlContent = "<html><body style='font-family:Arial,sans-serif;font-size:14px;color:#333;background:#f5f5f5;padding:20px;'>
<div style='max-width:520px;margin:0 auto;background:#fff;border:1px solid #ddd;padding:28px;'>

<h2 style='margin:0 0 4px;font-size:18px;color:#111;'>New Enquiry - Innov Interiors &amp; Architects</h2>
<p style='margin:0 0 20px;font-size:12px;color:#999;'>Respond within 4 business hours</p>

<div style='background:#fdf8f0;border:1px solid #e8d8b0;padding:16px;margin-bottom:20px;text-align:center;'>
  <p style='margin:0 0 6px;font-size:12px;color:#888;'>Phone</p>
  <a href='tel:+91{$mobileDigits}' style='font-size:22px;font-weight:bold;color:#b8862a;text-decoration:underline;letter-spacing:1px;'>{$mobile}</a><br>
  <a href='https://wa.me/91{$mobileDigits}?text={$waText}' style='display:inline-block;margin-top:10px;padding:8px 18px;background:#25d366;color:#fff;font-size:12px;font-weight:bold;text-decoration:none;'>WhatsApp</a>
</div>

<table style='width:100%;border-collapse:collapse;font-size:14px;'>
  <tr><td style='padding:8px 0;border-bottom:1px solid #eee;color:#888;width:35%;'>Name</td><td style='padding:8px 0;border-bottom:1px solid #eee;font-weight:bold;'>{$name}</td></tr>
  <tr><td style='padding:8px 0;border-bottom:1px solid #eee;color:#888;'>Email</td><td style='padding:8px 0;border-bottom:1px solid #eee;'><a href='mailto:{$email}' style='color:#b8862a;text-decoration:none;'>{$email}</a></td></tr>
  <tr><td style='padding:8px 0;border-bottom:1px solid #eee;color:#888;'>City</td><td style='padding:8px 0;border-bottom:1px solid #eee;'>{$city}</td></tr>
  <tr><td style='padding:8px 0;border-bottom:1px solid #eee;color:#888;'>Project Type</td><td style='padding:8px 0;border-bottom:1px solid #eee;font-weight:bold;color:#b8862a;'>{$requirement}</td></tr>
  <tr><td style='padding:8px 0;border-bottom:1px solid #eee;color:#888;'>Budget</td><td style='padding:8px 0;border-bottom:1px solid #eee;'>{$budget}</td></tr>" . ($landArea ? "
  <tr><td style='padding:8px 0;border-bottom:1px solid #eee;color:#888;'>Land Area</td><td style='padding:8px 0;border-bottom:1px solid #eee;font-weight:bold;'>{$landArea}</td></tr>" : "") . "
  <tr><td style='padding:8px 0;color:#888;'>IP</td><td style='padding:8px 0;color:#bbb;font-size:12px;'>{$ip}</td></tr>
</table>

" . ($message ? "<div style='margin-top:20px;background:#f9f9f9;border-left:3px solid #b8862a;padding:14px 16px;'>
  <p style='margin:0 0 6px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;'>Project Details</p>
  <p style='margin:0;font-size:14px;color:#333;line-height:1.6;'>{$message}</p>
</div>" : "") . "

<p style='margin:20px 0 0;font-size:11px;color:#bbb;text-align:center;'>Innov Interiors &amp; Architects - weinnovarch.com</p>
</div>
</body></html>";

    // --- SMTP Configuration ---
    $smtpHost = 'mail.weinnovarch.com';
    $smtpPort = 465;
    $smtpUser = 'contact@weinnovarch.com';
    $smtpPass = 'uV-Ya0lC84jng[IU';

    // Send email via SMTP to all recipients
    $emailSent = sendEmailViaSMTP($to, $subject, $htmlContent, $email, $name, $smtpHost, $smtpPort, $smtpUser, $smtpPass);

    // Fallback: Try mail() function if SMTP fails
    if (!$emailSent && function_exists('mail')) {
        $toString = is_array($to) ? implode(', ', $to) : $to;
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8\r\n";
        $headers .= "From: contact@weinnovarch.com\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $emailSent = @mail($toString, $subject, $htmlContent, $headers);
    }

    // --- Google Sheets Integration ---
    $googleScriptURL = "https://script.google.com/macros/s/AKfycbzVpXnvEiqAclMmGPX0cnz_tScNDzrrTcpoDCfMwDTa_FyXeZJFEqAcMvG_c1wOlY1img/exec";

    $googlePostData = [
        'Name'        => $name,
        'Number'      => $mobile,
        'Email'       => $email,
        'City'        => $city,
        'Requirement' => $requirement,
        'Budget'      => $budget,
        'LandArea'    => $landArea,
        'Message'     => $message,
        'IP'          => $ip,
        'timestamp'   => '',
    ];

    $ch2 = curl_init();
    curl_setopt($ch2, CURLOPT_URL, $googleScriptURL);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch2, CURLOPT_POSTFIELDS, http_build_query($googlePostData));
    curl_setopt($ch2, CURLOPT_POST, true);
    $googleResponse = curl_exec($ch2);
    curl_close($ch2);

    // Redirect after all done
    header('Location: thanks.php');
    exit();
}

/**
 * Helper function to read SMTP response (handles multi-line responses)
 */
function readSMTPResponse($socket) {
    $response = '';
    while ($line = fgets($socket, 515)) {
        $response .= $line;
        if (substr($line, 3, 1) == ' ') break;
    }
    return $response;
}

/**
 * Send email via SMTP using HostITBro email service
 * Configuration: mail.weinnovarch.com:465 (SSL/TLS)
 */
function sendEmailViaSMTP($to, $subject, $htmlContent, $replyTo, $replyToName, $smtpHost, $smtpPort, $smtpUser, $smtpPass) {
    if (empty($smtpPass) || $smtpPass === 'YOUR_EMAIL_PASSWORD_HERE') {
        error_log("SMTP password not configured.");
        return false;
    }

    if (!is_array($to)) {
        $to = [$to];
    }

    $to = array_filter(array_map('trim', $to));

    if (empty($to)) {
        error_log("SMTP: No valid recipients provided");
        return false;
    }

    $context = stream_context_create([
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true
        ]
    ]);

    $socket = @stream_socket_client(
        "ssl://{$smtpHost}:{$smtpPort}",
        $errno, $errstr, 30,
        STREAM_CLIENT_CONNECT,
        $context
    );

    if (!$socket) {
        error_log("SMTP Connection failed: {$errstr} ({$errno})");
        return false;
    }

    $response = readSMTPResponse($socket);
    if (substr($response, 0, 3) != '220') { fclose($socket); return false; }

    fputs($socket, "EHLO {$smtpHost}\r\n");
    $response = readSMTPResponse($socket);
    if (substr($response, 0, 3) != '250') { fclose($socket); return false; }

    fputs($socket, "AUTH LOGIN\r\n");
    $response = readSMTPResponse($socket);
    if (substr($response, 0, 3) != '334') { fclose($socket); return false; }

    fputs($socket, base64_encode($smtpUser) . "\r\n");
    $response = readSMTPResponse($socket);
    if (substr($response, 0, 3) != '334') { fclose($socket); return false; }

    fputs($socket, base64_encode($smtpPass) . "\r\n");
    $response = readSMTPResponse($socket);
    if (substr($response, 0, 3) != '235') {
        error_log("SMTP: Authentication failed: " . trim($response));
        fclose($socket);
        return false;
    }

    fputs($socket, "MAIL FROM: <{$smtpUser}>\r\n");
    $response = readSMTPResponse($socket);
    if (substr($response, 0, 3) != '250') { fclose($socket); return false; }

    foreach ($to as $recipient) {
        fputs($socket, "RCPT TO: <{$recipient}>\r\n");
        readSMTPResponse($socket);
    }

    fputs($socket, "DATA\r\n");
    $response = readSMTPResponse($socket);
    if (substr($response, 0, 3) != '354') { fclose($socket); return false; }

    $toHeader  = implode(', ', array_map(function($e) { return "<{$e}>"; }, $to));
    $emailData  = "From: Innov Interiors & Architects <{$smtpUser}>\r\n";
    $emailData .= "To: {$toHeader}\r\n";
    $emailData .= "Reply-To: {$replyToName} <{$replyTo}>\r\n";
    $emailData .= "Subject: {$subject}\r\n";
    $emailData .= "MIME-Version: 1.0\r\n";
    $emailData .= "Content-type: text/html; charset=UTF-8\r\n";
    $emailData .= "\r\n";
    $emailData .= $htmlContent . "\r\n";
    $emailData .= ".\r\n";

    fputs($socket, $emailData);
    $response = readSMTPResponse($socket);

    fputs($socket, "QUIT\r\n");
    fclose($socket);

    if (substr($response, 0, 3) == '250') {
        return true;
    } else {
        error_log("SMTP: Email sending failed: " . trim($response));
        return false;
    }
}
?>
