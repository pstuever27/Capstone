<?php

/**
 * Prolouge
 * File: kick-guest.php
 * Description: Handles PHP server functionality needed for kicking a guest
 * Programmer's Name: Rylan DeGarmo
 * Date Created: 11/12/2023 - Rylan DeGarmo
 * Date Revised: 11/12/2023 - Rylan DeGarmo - Creation
 * Date Revised: 2/3/2024 - Rylan DeGarmo - Implementation of SQL added for use with react
 * Preconditions: 
 *  @inputs : N/A
 * Postconditions:
 *  @returns : N/A
 * Error conditions: N/A
 * Side effects: None
 * Invariants: None
 * Known Faults: N/A
 * **/

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
exit(200);

?>
