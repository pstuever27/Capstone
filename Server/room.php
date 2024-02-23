<?php
header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

require_once('require/sql.php');
$status = 'closed';

$mysql = SQLConnect();
$stmt = $mysql -> prepare('SELECT roomCode FROM room WHERE BINARY roomCode = ?');
$stmt->bind_param('s', $POST['roomCode']);


$stmt->execute();
$result = $stmt -> get_result();
$row = mysqli_fetch_row($result);

if( $result || $row ) {
    $status = 'open';
}

$response = [
    'status' => $status
];

echo json_encode($response);
exit(200);

?>