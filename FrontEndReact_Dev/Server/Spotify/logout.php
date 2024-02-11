<?php
require '../../vendor/autoload.php';
require '../require/sql.php';

header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

$roomCode = file_get_contents('../../data/.roomCode');

file_put_contents("../../data/.accessToken", '');
file_put_contents("../../data/.refreshToken", '');

$response = [
  'status' => 'ok'
];

echo json_encode($response);
die();

?>