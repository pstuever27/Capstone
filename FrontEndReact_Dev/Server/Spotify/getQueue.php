<?php
/**
 * Prolouge
 * File: getQueue.php
 * Description: Handles getting the host's full queue from backend
 * Programmer's Name: Paul Stuever, Kieran Delaney
 * Date Created: 12/3/2023 
 * Preconditions: 
 *  Requires Spotify PHP API from vendor and client_ID and client_secret to be set to the appropriate credentials from our Spotify Dev app. Also, the authCreds.php should've ran to send the user to the login screen.
 * Postconditions:
 *  Returns spotify queue in json format or error
 * Error conditions: Returns error message if error occurs when trying to call getspotifyqueue vendor function
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/
require '../../vendor/autoload.php';
require '../require/sql.php';

//Get spotify app information from json (gitignore)
$json = file_get_contents('../../../client.json');
$appData = json_decode($json, true);

//Create new session with our web app information
$session = new SpotifyWebAPI\Session(
  $appData[0], //ClientID
  $appData[1], //Client Secret
);

// Open sql connection
$mysql = SQLConnect();

$status = 'wait';

//Prepare statement to get the access token and refresh token
$stmt = $mysql->prepare("SELECT accessToken, refreshToken FROM room WHERE roomCode = ?");
$stmt->bind_param('s', $_POST['roomCode']);
$stmt->execute(); //Execute sql

//If we have a token, then set that as our current 
if ($accessToken) {
  //Set the tokens as current in our session
  $session->setAccessToken($accessToken);
  $session->setRefreshToken($refreshToken);
} else {
  //Otherwise, just use the refresh token and it'll auto-refresh in the api call
  $session->refreshAccessToken($refreshToken);
}

//Set to auto refresh if needed
$options = [
  'auto_refresh' => true,
];

//Set up API
$api = new SpotifyWebAPI\SpotifyWebAPI($options, $session);

try {
  //Get the queue
  $response = $api->getMyQueue();
  
} catch (SpotifyWebAPI\SpotifyWebAPIException $e) { //If there's an error, send error response
  $response = [
    'status' => 'error',
    'error' => $e->getMessage()
  ];
}

echo json_encode($response);


?>