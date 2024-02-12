<?php

/**
 * Prolouge
 * File: toggle-explicit.php
 * Description: Handles PHP server functionality needed for toggling explicit song allowance.
 * Programmer's Name: Rylan DeGarmo
 * Date Created: 11/12/2023 - Rylan DeGarmo
 * Date Revised: 11/12/2023 - Rylan DeGarmo - Creation
 * Date Revised: 11/19/2023 - Rylan DeGarmo - Better implemeneted SQL
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : Returns error/ok response based upon if the song filter was toggled.
 * Error conditions: If there's a SQL error, then it will be returned to the js. Currently requires song implementation.
 * Side effects: None
 * Invariants: None
 * Known Faults: N/A
 * **/

 require_once('./require/sql.php');

$mysql = SQLConnect();

$status = 'wait';

$stmt = $mysql->prepare('SELECT explicitTog FROM client WHERE roomCode = ?');

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

    $row = $result->fetch_assoc()
    
    if ($row == 'YES') {
        $stmt = $mysql->prepare('UPDATE client SET explicitTog = "NO"" WHERE roomCode = ?');

        $stmt->bind_param('s', $_POST['roomCode']);
        $stmt->execute();
    }
    else {
        $stmt = $mysql->prepare('UPDATE client SET explicitTog = "YES" WHERE roomCode = ?');

        $stmt->bind_param('s', $_POST['roomCode']);
        $stmt->execute();
    }
}
exit(200);
?>