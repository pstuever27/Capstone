<?php

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