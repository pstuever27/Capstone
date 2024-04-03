<?php

/**
 * Prolouge
 * File: get-queue.php
 * Description: Handles PHP server functionality needed for displaying queued songs information
 * Programmer's Name: Paul Stuever
 * Date Created: 3/29/2024 - Paul Stuever
 * Date Revised: 3/29/2024 - Paul Stuever - Created file and worked on queue list functionality
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : Returns error/ok response based upon if there are queued songs.
 * Error conditions: If there's a SQL error, then it will be returned to the js 
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/

require_once('./require/sql.php');
header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

$mysql = SQLConnect();

$status = 'wait';

$stmt = $mysql->prepare('SELECT * FROM queueList WHERE roomCode = ?');

$stmt->bind_param('s', $_POST['roomCode']);
$stmt->execute();

$result = $stmt->get_result();
$row = $result->fetch_assoc();

if(!$result || !$row) {
    $status = 'no-queue';

    $response = [
        'status' => $status
    ];

    echo json_encode($response);
    return;
}
else{
    $status = 'ok';
    if ($row) {
        $myArray[] = $row; //this is needed for when only one guest, as the while loop won't execute
    }
    while ($row = $result->fetch_assoc()) {
        $myArray[] = $row;
    }
    $mysql->close();
    echo json_encode($myArray);
}
exit(200);
?>