<?php

//--------------REPLAY can be used by adding a song to the queue again --------------//

// require '../../vendor/autoload.php';
// require '../require/sql.php';

// //Get spotify app information from json (gitignore)
// $json = file_get_contents('../../../client.json');
// $appData = json_decode($json, true);

// //Create new session with our web app information
// $session = new SpotifyWebAPI\Session(
//   $appData[0], //ClientID
//   $appData[1], //Client Secret
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