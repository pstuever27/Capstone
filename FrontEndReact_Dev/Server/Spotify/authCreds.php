<?php

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