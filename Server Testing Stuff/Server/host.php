<?php

require_once('require/sql.php');

$mysql = SQLConnect();

$status = 'wait';

//Add gamecode to the database if it doesn't already exist
$stmt = $mysql->prepare('SELECT roomCode FROM room WHERE BINARY roomCode = ?');
$stmt->bind_param('s', $_POST['roomCode']);
$stmt->execute();


$result = $stmt->get_result();
$row = mysqli_fetch_row($result);


if (!$result || !$row) {
  $nextStmt = $mysql->prepare('INSERT INTO room (roomCode) VALUES (?)');

  $nextStmt->bind_param('s', $_POST['roomCode']);
  $nextStmt->execute();
  $status = 'ok';
  $response = [
    'status' => $status
  ];
  $mysql->close();
  echo json_encode($response);
  exit(200);
}
else {
  $status = 'error';

  $response = [
    'status' => $status
  ];
  echo json_encode($response);
  return;
}
?>