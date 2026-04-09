<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Sanitize inputs
$name    = isset($_POST['name'])    ? htmlspecialchars(strip_tags(trim($_POST['name'])))    : '';
$email   = isset($_POST['email'])   ? htmlspecialchars(strip_tags(trim($_POST['email'])))   : '';
$subject = isset($_POST['subject']) ? htmlspecialchars(strip_tags(trim($_POST['subject']))) : '';
$message = isset($_POST['message']) ? htmlspecialchars(strip_tags(trim($_POST['message']))) : '';

// Validation
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

// Recipient
$to = 'info@stephaniehillauthor.com';

// Email subject
$mail_subject = 'New Contact Form Submission: ' . $subject;

// Email body
$mail_body = "You have received a new message from the Stephanie Hill website.\n\n";
$mail_body .= "-------------------------------\n";
$mail_body .= "Name:    " . $name . "\n";
$mail_body .= "Email:   " . $email . "\n";
$mail_body .= "Subject: " . $subject . "\n";
$mail_body .= "-------------------------------\n\n";
$mail_body .= "Message:\n" . $message . "\n\n";
$mail_body .= "-------------------------------\n";
$mail_body .= "Sent from: Stephanie Hill Website Contact Form\n";

// Headers
$headers  = "From: noreply@stephaniehill.com\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$sent = mail($to, $mail_subject, $mail_body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again later.']);
}
?>
