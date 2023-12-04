<?php

//import spotify api wrapper
require '../../vendor/autoload.php';

//Get spotify app information from json (gitignore)
$json = file_get_contents('../../../client.json');
$appData = json_decode($json, true);

//Create new session with our web app information
$session = new SpotifyWebAPI\Session(
  $appData[0], //ClientID
  $appData[1], //Client Secret
  $appData[2] // Redirect URI
);

//Create new state to verify valid session 
$state = $session->generateState();

//Settings options to allow for spotify functions in the authorization code flow
$options = [
  'scope' => [
    'ugc-image-upload',
    'user-follow-read',
    'user-follow-modify',
    'user-read-recently-played',
    'user-top-read',
    'user-read-playback-position',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-modify-playback-state',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
    'playlist-read-private',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
  ],
  'state' => $state, //State gets passed to callback
  'roomCode' => $_POST['roomCode'] //roomCode gets passed to callback
];

header('Location: ' . $session->getAuthorizeUrl($options)); //Runs the spotify api reqest for auth code, then redirects to our callback, which is callback.php
die();
?>