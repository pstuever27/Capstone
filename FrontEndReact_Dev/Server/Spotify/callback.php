<?php
/**
 * Prolouge
 * File: callback.php
 * Description: Handles spotify callback of auth code login method from backend
 * Programmer's Name: Paul Stuever, Kieran Delaney
 * Date Created: 12/3/2023 
 * Preconditions: 
 *  Requires Spotify PHP API from vendor and client_ID and client_secret to be set to the appropriate credentials from our Spotify Dev app. Also, the authCreds.php should've ran to send the user to the login screen.
 * Postconditions:
 *  Uses the code from authorization code login to get the access token and refresh token parameter for making spotify calls which require a spotify account permissions.
 * Error conditions: If there's a state mismatch, this may mean that the session has been corrupted or an attack occurred upon it, so we kill it as a security measure.
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