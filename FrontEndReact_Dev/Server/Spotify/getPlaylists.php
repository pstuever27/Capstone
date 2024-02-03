<?php
/**
 * Prologue
 * File: getPlaylists.php
 * Description: Fetches Spotify user's playlists
 * Programmer's Name: Chinh Nguyen
 * Date Created: 2/2/2024
 * Preconditions: 
 *  Requires Spotify PHP API from vendor and client_ID and client_secret to be set to the appropriate credentials from our Spotify Dev app.
 * Postconditions:
 *  @returns: JSON array of user's playlists. If failed, returns error JSON.
 * Error conditions: If fetching playlists fails, return error wrapped in JSON.
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 **/

require '../../vendor/autoload.php';
require '../require/sql.php';

header('Access-Control-Allow-Origin: *'); // Uncomment for local testing
header('Content-Type: application/json');

// testing jsx and php connection
//echo json_encode("hello! php connection here!");

// Get Spotify app information from json (ignored by git)
$info = file_get_contents('../../client.json');
$json = json_decode($info);

// Create new session with our web app information
$session = new SpotifyWebAPI\Session(
    $json->CLIENT_ID, // ClientID
    $json->CLIENT_SECRET // Client Secret
);

// Open SQL connection
$mysql = SQLConnect();

$accessToken = null;
$refreshToken = null;

if (isset($_POST['roomCode'])) {
    // Prepare statement to get the access token and refresh token
    $stmt = $mysql->prepare("SELECT accessToken, refreshToken FROM room WHERE roomCode = ?");
    $stmt->bind_param('s', $_POST['roomCode']);
    $stmt->execute(); // Execute SQL

    $result = $stmt->get_result();
    if ($result) {
        $row = $result->fetch_assoc();
        if ($row) {
            $accessToken = $row["accessToken"];
            $refreshToken = $row["refreshToken"];
        }
    }
}

if ($refreshToken) {
    try {
        $session->refreshAccessToken($refreshToken);
        $accessToken = $session->getAccessToken();
        $session->setAccessToken($accessToken);
    } catch (SpotifyWebAPI\SpotifyWebAPIException $e) {
        $response = [
            'status' => 'error',
            'message' => 'Could not refresh access token',
            'error' => $e->getMessage()
        ];
        echo json_encode($response);
        exit;
    }
} else {
    $response = [
        'status' => 'error',
        'message' => 'No refresh token available'
    ];
    echo json_encode($response);
    exit;
}

$stmt = $mysql->prepare("SELECT accessToken, refreshToken FROM room WHERE roomCode = ?");
$stmt->bind_param('s', $_POST['roomCode']);
$stmt->execute(); 

$result = $stmt->get_result();
$row = $result->fetch_assoc();
$accessToken = $row["accessToken"];
$refreshToken = $row["refreshToken"];

// Check and refresh the access token as necessary
if ($accessToken) {
    $session->setAccessToken($accessToken);
    $session->setRefreshToken($refreshToken);
} else {
    $session->refreshAccessToken($refreshToken);
}

$options = [
    'auto_refresh' => true,
];

// Set up API
$api = new SpotifyWebAPI\SpotifyWebAPI($options, $session);

// Try to fetch the user's playlists
try {
    $playlists = $api->getUserPlaylists('me', [
        'limit' => 20
    ]);

    $response = [
        'status' => 'ok',
        'data' => $playlists->items
    ];
} catch (SpotifyWebAPI\SpotifyWebAPIException $e) {
    $response = [
        'status' => 'error',
        'error' => $e->getMessage()
    ];
}

// Send response
echo json_encode($response);
?>
