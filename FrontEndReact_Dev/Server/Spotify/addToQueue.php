<?php
/**
 * Prolouge
 * File: addToQueue.php
 * Description: Handles spotify add to queue call from backend
 * Programmer's Name: Paul Stuever, Kieran Delaney
 * Date Created: 12/3/2023 
 * Preconditions: 
 *  Requires Spotify PHP API from vendor and client_ID and client_secret to be set to the appropriate credentials from our Spotify Dev app.
 * Postconditions:
 *  @returns : If add to queue call is successful, return JSON with ok status. If not, return error JSON
 * Error conditions: If add to queue fails, return error wrapped in JSON.
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/
require '../../vendor/autoload.php';
require '../require/sql.php';

$session = new SpotifyWebAPI\Session(
  'CLIENT_ID', //CLIENT_ID
  'CLIENT_SECRET', //CLIENT_SECRET 
);

$mysql = SQLConnect();

$status = 'wait';

$stmt = $mysql->prepare("SELECT accessToken, refreshToken FROM room WHERE roomCode = ?");
$stmt->bind_param('s', $_POST['roomCode']);
$stmt->execute();

if ($accessToken) {

  $session->setAccessToken($accessToken);
  $session->setRefreshToken($refreshToken);
} else {

  $session->refreshAccessToken($refreshToken);
}

$options = [
  'auto_refresh' => true,
];

$api = new SpotifyWebAPI\SpotifyWebAPI($options, $session);

try {
  $api->queue($_POST['query']);
  $response = [
    'status' => 'ok',
  ];
} catch (SpotifyWebAPI\SpotifyWebAPIException $e) {
  $response = [
    'status' => 'error',
    'error' => $e->getMessage()
  ];
}

echo json_encode($response);

?>
