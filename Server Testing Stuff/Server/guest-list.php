<?php

require_once('./require/sql.php');

$mysql = SQLConnect();

$status = 'wait';

$stmt = $mysql->prepare('SELECT userName FROM client WHERE roomCode = ?');

$stmt->bind_param('s', $_POST['roomCode']);
$stmt->execute();

$result = $stmt->get_result();
$row = $result->fetch_assoc();

if(!$result || !$row) {
    $status = 'no-guests';

    $response = [
        'status' => $status
    ];

    echo json_encode($response);
    return;
}
else{
    $status = 'ok';
        $myArray[] = $row;
    while($row = $result->fetch_assoc()) {
        $myArray[] = $row;
    }
    echo json_encode($myArray);
}

?>