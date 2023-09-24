<?php
require_once('require/error.php');
require_once('require/sql.php');
$mysql = SQLConnect();
$status = 'wait';

//Check if the gamecode exists
$stmt = $mysql -> prepare('SELECT roomCode FROM room WHERE BINARY roomCode = ?');
$stmt -> bind_param('s', $_POST['roomCode']);
$stmt -> execute();

$result = $stmt -> get_result();
$row = mysqli_fetch_row($result);

if(!$result || !$row) {
    $status = 'error';
    $response = ['status' => $status, 
                 'error' => "Room Doesn't Exist!"    
                ];
    echo json_encode($response);
    return;
}
else {
    $roomCode = $row[0];
    $status = 'ok';
    $response = [
        'roomCode' => $roomCode,
        'status' => $status
    ];
    $mysql->close();
    echo json_encode($response);
}
exit(200);

?>
