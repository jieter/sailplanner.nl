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
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authKey = explode(' ', $_SERVER['HTTP_AUTHORIZATION'])[1];
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($key) {
        // Update an existing planner
        if ($data['key'] != $key) {
            error('Key in payload is not equal to key in URL.', 406);
        }
        if (!$authKey) {
            incorrect_credentials();
        }

        $current = json_decode(file_get_contents($filename), true);
        if ($current['authKey'] != $authKey) {
            incorrect_credentials();
        }
    } else {
        // Create a new planner
        $key = $data['key'] = substr(md5(microtime()), 0, 12);
        $authKey = $data['authKey'] = substr(md5(microtime()), 0, 12);

        $url = $data['url'] = "http://sailplanner.nl/beta/#$key";
        $data['editUrl'] = "$url|$authKey";

        $filename = get_filename($data['key']);
    }

    file_put_contents($filename, json_encode($data, ENCODE_OPTIONS));
} else {
    // Serve data for an existing planner
    if (!$key) {
        error('No key provided');
    }
    $data = json_decode(file_get_contents($filename), true);

    // If no authKey is supplied, or it is not equal to the authKey stored,
    // do not leak them anyway.
    if ($data['authKey'] != $authKey) {
        unset($data['authKey']);
        unset($data['editUrl']);
    }
}

// Always serve the planner with the key it is requested with.
$data["key"] = $key;

print(json_encode($data, ENCODE_OPTIONS));
?>
