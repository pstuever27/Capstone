
<?php
require '../../vendor/autoload.php';
require '../require/error.php';

header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

$session = new SpotifyWebAPI\Session(
    'CLIENT_ID', //CLIENT_ID
    'CLIENT_SECRET', //CLIENT_SECRET 
);

$session->requestCredentialsToken();
$accessToken = $session->getAccessToken();


if($accessToken) {
    $response = [
        'status' => 'ok',
        'token' => $accessToken
    ];
}
else {
    $response = errorResponse('Error recieving client access token');

}
echo json_encode($response);
exit(200);
?>
