<?php

/**
 * Prolouge
 * File: guest-list.php
 * Description: Handles PHP server functionality needed for displaying guest information
 * Programmer's Name: Paul Stuever
 * Date Created: 10/22/2023 - Paul Stuever
 * Date Revised: 10/22/2023 - Paul Stuever - Created file and worked on guest list functionality
 *     Revision: 11/5/2023 - Paul Stuever - Integrate into React frontend 
 *     Revision: 2/11/2024 - Kieran Delaney - Added access control header for local testing
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : Returns error/ok response based upon if there are guests.
 * Error conditions: If there's a SQL error, then it will be returned to the js 
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/

require_once('./require/sql.php');
header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

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
    while($row = $result->fetch_assoc()) {
        $myArray[] = $row;
    }
    echo json_encode($myArray);
}
exit(200);
?>