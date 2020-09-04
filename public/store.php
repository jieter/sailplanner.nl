<?php
/*
 * Sailplanner.nl store implementation
 */

function error($message, $status_code=500) {
    http_response_code($status_code);
    print(json_encode(array(
        'success' => false,
        'message' => $message
    )));
    exit();
}

function not_found() {
    error("File not found", 404);
}

function incorrect_credentials() {
    error("Incorrect credentials", 401);
}

function get_filename($key) {
    return "../store/$key.json";
}

function debug($data) {
    ob_start();
    print('debug:');
    var_dump($data);
    error_log(ob_get_clean(), 4);
}

$key = $_GET['key'];

if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authKey = explode(' ', $_SERVER['HTTP_AUTHORIZATION'])[1];
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($key) {
        $filename = get_filename($key);
        if ($data['key'] != $key) {
            error('Key in payload is not equal to key in URL.', 406);
        }
        if (!file_exists($filename)) {
            not_found();
        }
        debug($authKey);
        if (!$authKey) {
            incorrect_credentials();
        }

        $current = json_decode(file_get_contents($filename), true);
        if ($current['authKey'] != $authKey) {
            incorrect_credentials();
        }
    } else {
        $key = $data['key'] = substr(md5(microtime()), 0, 12);
        $authKey = $data['authKey'] = substr(md5(microtime()), 0, 12);

        $url = $data['url'] = "http://sailplanner.nl/#$key";
        $data['editUrl'] = "$url|$authKey";

        $filename = get_filename($data['key']);
    }

    file_put_contents($filename, json_encode($data, JSON_UNESCAPED_SLASHES));
} else {
    if (!$key) {
        error('No key provided');
    }
    $filename = get_filename($key);
    if (!file_exists($filename)) {
        not_found();
    }
    $data = json_decode(file_get_contents($filename), true);
    if (!$authKey) {
        unset($data['authKey']);
    }

    if ($data['authKey'] != $authKey) {
        incorrect_credentials();
    }
}

// Always serve the planner with the key it is requested with.
$data["key"] = $key;

print(json_encode($data, JSON_UNESCAPED_SLASHES));
?>
