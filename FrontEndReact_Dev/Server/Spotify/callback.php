<?php
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