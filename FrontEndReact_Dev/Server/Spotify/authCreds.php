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
// $json = file_get_contents('../../client.json');
// $appData = json_decode($json, true);

//Create new session with our web app information
$session = new SpotifyWebAPI\Session(
  "8dc1522f50e34d7d8a5d4a2c0daae8b4", // $appData[0], //ClientID
  "be8dd5266da54a048d7b04c3ef9fbcc0", // $appData[1], //Client Secret
  "http://localhost:8000/Server/Spotify/callback.php" // $appData[2] // Redirect URI
);

//Create new state to verify valid session 
$state = $session->generateState();

file_put_contents('../../data/.roomCode', $_GET['roomCode']);

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

header('Location: ' . $session->getAuthorizeUrl($options)); //Runs the spotify api reqest for auth code, then redirects to our callback, which is callback.php
die();
?>