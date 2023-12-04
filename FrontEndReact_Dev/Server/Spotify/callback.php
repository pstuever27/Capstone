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

$session = new SpotifyWebAPI\Session(
'CLIENT_ID',
'CLIENT_SECRET',
'REDIRECT_URI'
);

$state = $_GET['state'];
$roomCode = $_GET['roomCode'];

// Fetch the stored state value from somewhere. A session for example

if ($state !== $storedState) {
// The state returned isn't the same as the one we've stored, we shouldn't continue
die('State mismatch');
}

// Request a access token using the code from Spotify
$session->requestAccessToken($_GET['code']);

$accessToken = $session->getAccessToken();
$refreshToken = $session->getRefreshToken();

// Store the access and refresh tokens somewhere. In a session for example
$mysql = SQLConnect();

$status = 'wait';

$stmt = $mysql->prepare("UPDATE room SET accessToken = ?, refreshToken = ? WHERE roomCode = ?");
$stmt->bind_param('sss', $accessToken, $refreshToken, $roomCode);
$stmt->execute();

// Send the user along and fetch some data!
header('Location: ' . 'localhost:3000/Host');
die();

?>