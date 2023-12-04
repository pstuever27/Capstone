<?php
require '../../vendor/autoload.php';
require '../require/sql.php';

//Get spotify app information from json (gitignore)
$json = file_get_contents('../../../client.json');
$appData = json_decode($json, true);

//Create new session with our web app information
$session = new SpotifyWebAPI\Session(
  $appData[0], //ClientID
  $appData[1], //Client Secret
  $appData[2] // Redirect URI
);

//Get the state from authCreds.php
$state = $_GET['state'];
//Get the roomCode from authCreds.php
$roomCode = $_GET['roomCode'];

//-----Work in progress for verification

// // Fetch the stored state value from somewhere. A session for example


// //Verify that our states match
// if ($state !== $storedState) {
// // The state returned isn't the same as the one we've stored, we shouldn't continue
// die('State mismatch');
// }

// Request a access token using the code from Spotify
$session->requestAccessToken($_GET['code']);

//Get the access token and refresh token from the session
$accessToken = $session->getAccessToken();
$refreshToken = $session->getRefreshToken();

// Store the access and refresh tokens somewhere. In a database for example
$mysql = SQLConnect();

$status = 'wait';
// Prepare sql query to store our tokens in the database corresponding to our roomCode
$stmt = $mysql->prepare("UPDATE room SET accessToken = ?, refreshToken = ? WHERE roomCode = ?");
$stmt->bind_param('sss', $accessToken, $refreshToken, $roomCode);
$stmt->execute(); //Execute sql

// Send the user along and fetch some data!
header('Location: ' . 'localhost:3000/Host');
die();

?>