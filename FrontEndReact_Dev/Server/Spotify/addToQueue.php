<?php
require '../../vendor/autoload.php';
require '../require/sql.php';

//Get spotify app information from json (gitignore)
$json = file_get_contents('../../../client.json');
$appData = json_decode($json, true);

//Create new session with our web app information
$session = new SpotifyWebAPI\Session(
  $appData[0], //ClientID
  $appData[1], //Client Secret
);

// Open sql connection
$mysql = SQLConnect();

$status = 'wait';

//Prepare statement to get the access token and refresh token
$stmt = $mysql->prepare("SELECT accessToken, refreshToken FROM room WHERE roomCode = ?");
$stmt->bind_param('s', $_POST['roomCode']);
$stmt->execute(); //Execute sql

//If we have a token, then set that as our current 
if ($accessToken) {
  //Set the tokens as current in our session
  $session->setAccessToken($accessToken);
  $session->setRefreshToken($refreshToken);
} else {
 //Otherwise, just use the refresh token and it'll auto-refresh in the api call
  $session->refreshAccessToken($refreshToken);
}

//Set to auto refresh if needed
$options = [
  'auto_refresh' => true,
];

//Set up API
$api = new SpotifyWebAPI\SpotifyWebAPI($options, $session);

//Try to add the song to the queue
try {
  $api->queue($_POST['query']);
  //Send response
  $response = [
    'status' => 'ok',
  ];
} catch (SpotifyWebAPI\SpotifyWebAPIException $e) { //If there's an issue with the api call, then throw error
  $response = [
    'status' => 'error',
    'error' => $e->getMessage()
  ];
}

//Send response
echo json_encode($response);

?>
