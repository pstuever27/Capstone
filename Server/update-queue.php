<?php

require_once('./require/sql.php');
header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

$mysql = SQLConnect();

$status = 'wait';

$stmt = $mysql->prepare('DELETE FROM queueList WHERE roomCode = ?');

$stmt->bind_param('s', $_POST['roomCode']);
$stmt->execute();

$queue = json_decode($_POST['queueList'], true);
$index = 0;
if($queue){
        
        $stmt = $mysql->prepare('INSERT INTO queueList(roomCode, songInfo, pos) VALUES (?, ?, ?)');
        $stmt->bind_param('ssi', $_POST['roomCode'], $_POST['queueList'], $index);
        $stmt->execute();

        $index++;

}


?>