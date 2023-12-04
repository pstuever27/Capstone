<?php
/**
 * Prolouge
 * File: replay.php
 * Description: Handles replaying the currently playing song from backend
 * Programmer's Name: Paul Stuever, Kieran Delaney
 * Date Created: 12/3/2023 
 * Preconditions: 
 *  Requires Spotify PHP API from vendor and client_ID and client_secret to be set to the appropriate credentials from our Spotify Dev app. Also, the authCreds.php should've ran to send the user to the login screen.
 * Postconditions:
 *  Readds currently playing song to queue
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/

//--------------REPLAY can be used by adding a song to the queue again --------------//

// require '../../vendor/autoload.php';
// require '../require/sql.php';

// $session = new SpotifyWebAPI\Session(
//   'CLIENT_ID', //CLIENT_ID
//   'CLIENT_SECRET', //CLIENT_SECRET 
// );

// $mysql = SQLConnect();

// $status = 'wait';

// $stmt = $mysql->prepare("SELECT accessToken, refreshToken FROM room WHERE roomCode = ?");
// $stmt->bind_param('s', $_POST['roomCode']);
// $stmt->execute();

// if ($accessToken) {

//   $session->setAccessToken($accessToken);
//   $session->setRefreshToken($refreshToken);
// } else {

//   $session->refreshAccessToken($refreshToken);
// }

// $options = [
//   'auto_refresh' => true,
// ];

// $api = new SpotifyWebAPI\SpotifyWebAPI($options, $session);

// try {
//   $api->();
//   $response = [
//     'status' => 'ok',
//   ];
// } catch (SpotifyWebAPI\SpotifyWebAPIException $e) {
//   $response = [
//     'status' => 'error',
//     'error' => $e->getMessage()
//   ];
// }

// echo json_encode($response);


?>