
<?php
/**
 * Prolouge
 * File: clientCreds.php
 * Description: Handles spotify client credentials method of authentication from backend
 * Programmer's Name: Paul Stuever, Kieran Delaney
 * Date Created: 12/3/2023 
 * Preconditions: 
 *  Requires Spotify PHP API from vendor and client_ID and client_secret to be set to the appropriate credentials from our Spotify Dev app. Also, the authCreds.php should've ran to send the user to the login screen.
 * Postconditions:
 *  Gets access token for making spotify API calls that don't require login and returns it to the caller in JSON 
 * Error conditions: If the access token doesn't get created for whatever reason, an error is returned as the JSON response to the caller
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/
require '../../vendor/autoload.php';
require '../require/error.php';

header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

$session = new SpotifyWebAPI\Session(
    '8dc1522f50e34d7d8a5d4a2c0daae8b4', //CLIENT_ID
    'be8dd5266da54a048d7b04c3ef9fbcc0', //CLIENT_SECRET 
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
