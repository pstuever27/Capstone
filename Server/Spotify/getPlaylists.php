<?php
/**
 * Prologue
 * File: getPlaylists.php
 * Description: Fetches Spotify user's playlists
 * Programmer's Name: Chinh Nguyen
 * Date Created: 2/2/2024
 * Revised on: 2/10/2024
 * Revision: Chinh implemented working function to call Spotify API to fetch playlists
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

// Get contents from client.json file
$info = file_get_contents('../../client.json');
$json = json_decode($info);

// Creating new session with Client ID and Secret
$session = new SpotifyWebAPI\Session(
    $json->CLIENT_ID, //ClientID
    $json->CLIENT_SECRET, //Client Secret
);

// Opening SQL Connection
$mysql = SQLConnect();

// Set status to wait
$status = 'wait';

// Prepare statement to get the access token and refresh token
$stmt = $mysql->prepare("SELECT accessToken, refreshToken FROM room WHERE roomCode = ?");
$stmt->bind_param('s', $_POST['roomCode']);

// Execution of SQL statement
$stmt->execute();

// Get result from SQL
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$accessToken = $row["accessToken"];
$refreshToken = $row["refreshToken"];

// If we have a token, then set that as our current
if ($accessToken) {
    // Set the tokens as current in our session
    $session->setAccessToken($accessToken);
    $session->setRefreshToken($refreshToken);
} else {
    // Otherwise, just use the refresh token and it'll auto-refresh in the api call
    $session->refreshAccessToken($refreshToken);
}

// Set to auto refresh if needed
$options = [
    'auto_refresh' => true,
];

//Set up API
$api = new SpotifyWebAPI\SpotifyWebAPI($options, $session);

try {
    // Use Spotify API PHP Wrapper to get user's display name
    $me = $api->me();

    // Use Spotify API PHP Wrapper to get user's playlists from display name
    $playlists = $api->getUserPlaylists($me->id, [
        'limit' => 25 // Limit to 25 playlists, temporary -- [TODO] Fetch ALL playlists
    ]);

    // $id = $playlists['items'][0]['id'];

    //$response = $playlists->items[0]->id;

    $response = array();

    foreach ($playlists->items as $playlist) {
        // For each playlist, create an associative array with 'id' and 'name'
        $playlist = array(
            'id' => $playlist->id,
            'name' => $playlist->name
        );
        
        // Add this associative array to the responses array
        $response[] = $playlist;
    }
    
} catch (SpotifyWebAPI\SpotifyWebAPIException $e) { //If there's an error, send error response
    $response = [
        'status' => 'error',
        'error' => $e->getMessage()
    ];
}

// testing jsx and php connection
// echo json_encode("hello! php connection here!");

/* THIS IS OLD CODE, NEED TO BE REMOVED
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
*/

$mysql->close();

// Send response
echo json_encode($response);

?>