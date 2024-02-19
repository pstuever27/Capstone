<?php
/**
 * Prologue
 * File: getTracks.php
 * Description: Fetches all tracks from a Spotify playlist
 * Programmer's Name: Chinh Nguyen
 * Date Created: 2/18/2024
 * Preconditions:
 *  Requires track ID to be passed in
 *  Requires Spotify PHP API from vendor and client_ID and client_secret to be set to the appropriate credentials from our Spotify Dev app.
 * Postconditions:
 *  @returns: JSON array of tracks in playlist. If failed, returns error JSON.
 * Error conditions: If fetching tracks fails, return error wrapped in JSON.
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

// Extract trackID from POST data
$playlistID = isset($_POST['playlistID']) ? $_POST['playlistID'] : null;

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
    $response = "WITHIN PHP FILE: playlistID = " . $playlistID;
} catch (SpotifyWebAPI\SpotifyWebAPIException $e) { //If there's an error, send error response
    $response = [
        'status' => 'error',
        'error' => $e->getMessage()
    ];
}

// Send response
echo json_encode($response);

?>