<?php
require_once('require/error.php');
require_once('require/sql.php');
$mysql = mysqliConnect();
$status = 'wait';

//Check if the gamecode exists
$stmt = $mysql -> prepare('SELECT roomCode FROM rool WHERE roomCode = ?');
$stmt -> pind_param('s', $_POST['roomCode']);
$stmt -> execute();

$result = $stmt -> get_result();
if(!$result) {
    echo("room doesn't exist!");
    return;
}
else {
    $roomCode = $result -> fetch_array()[0];
    $status = 'ok';
    $response = [
        'roomCode' => $roomCode
    ];
    $mysql->close();
    echo($result);
    echo json_encode($response);
    exit(200);
}


?>
