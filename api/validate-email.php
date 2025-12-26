<?php
// Set headers for CORS and JSON content
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get email from query parameter
$email = isset($_GET['email']) ? $_GET['email'] : '';

// Validate email format basic check
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid or missing email parameter"]);
    exit();
}

// Extract domain
$parts = explode('@', $email);
$domain = array_pop($parts);

// Check MX record
if (checkdnsrr($domain, "MX")) {
    echo json_encode(["isValid" => true]);
} else {
    // No MX records found
    echo json_encode(["isValid" => false, "reason" => "no_mx_records"]);
}
?>
