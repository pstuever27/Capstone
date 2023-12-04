<?php
/**
 * Prolouge
 * File: search.php
 * Description: Handles searching spotify tracks from backend
 * Programmer's Name: Paul Stuever, Kieran Delaney
 * Date Created: 12/3/2023 
 * Preconditions: 
 *  clientCreds.php should've been ran so that an access token is made to be used for these spotify API calls.
 * Postconditions:
 *  Returns json response of the spotify search API call
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/
require '../../vendor/autoload.php';
require '../require/error.php';

header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

$accessToken = $_POST['token'];
$query = $_POST['query'];

$api = new SpotifyWebAPI\SpotifyWebAPI();
$api->setAccessToken($accessToken);

$results = $api->search($query, 'track');

echo json_encode($results);
?>