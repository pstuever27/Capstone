<?php
/**
 * Prolouge
 * File: authCreds.php
 * Description: Handles spotify authorization code login method call from backend
 * Programmer's Name: Paul Stuever, Kieran Delaney
 * Date Created: 12/3/2023 
 * Preconditions: 
 *  Requires Spotify PHP API from vendor and client_ID and client_secret to be set to the appropriate credentials from our Spotify Dev app.
 * Postconditions:
 *  @returns : Redirects the app to the spotify login page to get authenticated
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/

//import spotify api wrapper
require '../../vendor/autoload.php';

header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

//Get spotify app information from json (gitignore)
$info = file_get_contents('../../client.json');
$json = json_decode($info);

//Create new session with our web app information
$session = new SpotifyWebAPI\Session(
  $json->CLIENT_ID, //ClientID
  $json->CLIENT_SECRET, //Client Secret
  $json->REDIRECT_URI // Redirect URI
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
];

error_log($session->getAuthorizeUrl($options));

$path = $session->getAuthorizeUrl($options);

echo "<script>location.href='$path';</script>";

?>