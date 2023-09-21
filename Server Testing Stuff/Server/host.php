<?php
## Add error handling

require_once('require/sql.php');
$sql = SQLConnect()();
$status = 'wait';

#Add gamecode to the database
$stmt = $sql->prepare('INSERT INTO room (roomCode) VALUES (?)');

?>