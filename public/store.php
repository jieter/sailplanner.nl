<?php
/*
 * Sailplanner.nl store implementation
 */

 define('ENCODE_OPTIONS', JSON_UNESCAPED_UNICODE| JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);

function error($message, $status_code=500) {
    http_response_code($status_code);
    print(json_encode(array('success' => false, 'message' => $message)));
    exit();
}
function not_found() {             error('File not found', 404); }
function incorrect_credentials() { error('Incorrect credentials', 401); }

function get_filename($key) {
    return "../store/$key.json";
}

$key = $_GET['key'];
if ($key) {
    $filename = get_filename($key);
    if (!file_exists($filename)) {
        not_found();
    }
}
$authToken = $_GET['authToken'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $now = date(DateTime::ISO8601);

    if ($key) {
        // Update an existing planner
        if ($data['key'] != $key) {
            error('Key in payload is not equal to key in URL', 406);
        }
        if (!$authToken) {
            incorrect_credentials();
        }

        $current = json_decode(file_get_contents($filename), true);
        if ($current['authToken'] != $authToken) {
            incorrect_credentials();
        }
    } else {
        // Create a new planner
        $key = $data['key'] = substr(md5(microtime()), 0, 12);
        $authToken = $data['authToken'] = substr(md5(microtime()), 0, 12);
        $data['created'] = $now;

        $filename = get_filename($data['key']);
    }
    $data['modified'] = $now;

    file_put_contents($filename, json_encode($data, ENCODE_OPTIONS));
} else {
    // Serve data for an existing planner
    if (!$key) {
        error('No key provided');
    }
    $data = json_decode(file_get_contents($filename), true);

    // If no authToken is supplied, or it is not equal to the authToken stored,
    // do not leak them anyway.
    if ($data['authToken'] != $authToken) {
        unset($data['authToken']);
    }
}

// Always serve the planner with the key it is requested with.
$data["key"] = $key;

print(json_encode($data, ENCODE_OPTIONS));
?>
