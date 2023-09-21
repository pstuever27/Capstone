<?php
## Add error handling

require_once('require/sql.php');
$sql = SQLConnect();
$status = 'wait';

echo("test");
var_dump($_POST);
#Add gamecode to the database
$stmt = $sql->prepare('INSERT INTO room (roomCode) VALUES (?)');
$stmt -> bind_param('s', $_POST['roomCode']);
$stmt -> execute();

?>