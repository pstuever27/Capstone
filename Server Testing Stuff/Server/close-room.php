<?php
require_once('require/error.php');
require_once('require/sql.php');

$mysql = SQLConnect();
$status = 'wait';

$stmt = $mysql -> prepare('DELETE FROM room WHERE roomCode = ?');
$stmt -> bind_param('s', $_POST['roomCode']);
$stmt -> execute();

$stmt = $mysql -> prepare('SELECT createdAt FROM room WHERE roomCode = ?');
$stmt -> bind_param('s', $_POST['roomCode']);
$stmt -> execute();

$result = $stmt -> get_result();
if($result || $row)
{
    echo mysqli_fetch_row($result);
    $response = ['status' => 'error',
                 'error' => 'Error closing room!'];
    echo json_encode($response);
    return;
}
//If we get here, then deleteing the room worked and we can then continue and delete all the users in the room
$stmt = $mysql -> prepare('DELETE FROM client WHERE roomCode = ?');
$stmt -> bind_param('s', $_POST['roomCode']);
$stmt -> execute();
if(mysqli_affected_rows($mysql) == 0){
    $response = ['status' => 'error',
                 'error' => 'Error removing users!'];
    echo json_encode($response);
    return;
} else {
    $response = [
        'status' => 'ok'
    ];
    echo json_encode($response);
    return;
}

//If we get here, then we can consider the removal a success

exit(200);


?>