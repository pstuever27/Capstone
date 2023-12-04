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
require '../../vendor/autoload.php';

$session = new SpotifyWebAPI\Session(
  'CLIENT_ID',
  'CLIENT_SECRET',
  'REDIRECT_URI'
);

$state = $session->generateState();

$options = [
  'scope' => [
    'playlist-read-private',
    'user-read-private',
  ],
  'state' => $state,
  'roomCode' => $_POST['roomCode']
];

header('Location: ' . $session->getAuthorizeUrl($options));
die();
?>