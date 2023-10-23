<?php

/**
 * Prolouge
 * File: close-room.php
 * Description: Handles PHP server functionality needed for closing a room
 * Programmer's Name: Paul Stuever
 * Date Created: 10/22/2023 - Paul Stuever
 * Date Revised: 10/22/2023 - Paul Stuever - Created file and worked on close room functionality
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : Returns error/ok response based upon if the room could be closed.
 * Error conditions: If there's a SQL error, then it will be returned to the js 
 * Side effects: None
 * Invariants: None
 * Known Faults: Requires more error handling for edge cases, SQL seems to have issues with deletion
 * **/

 //Add simple sql error handling
require_once('require/error.php');
//mySQL framework
require_once('require/sql.php');
mysqli_report(MYSQLI_REPORT_STRICT); // Tried to figure out errors in mySQL. Hasn't resulted to much

//Display errors 
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

//Connect to SQL
$mysql = SQLConnect();

//Uncomment for connection error testing
// echo $mysql->connect_errno;

//Set status to 'wait' until determination is made later
$status = 'wait';

//prepare, bind, and execute mySQL query
$stmt = $mysql -> prepare('DELETE FROM room WHERE roomCode = ?');
$stmt -> bind_param('s', $_POST['roomCode']);
$stmt->execute();

//affected_rows will return >0 if the deletion works
if($mysql->affected_rows == 0)
{
    //Respond with error because nothing was deleted
    $response = ['status' => 'error',
                 'error' => $mysql->error];
    $mysql->close();
    //Send response
    echo json_encode($response);
    return;
}
//If we get here, then deleteing the room worked and we can then continue and delete all the users in the room

//Now delete all the associated guests
$stmt = $mysql -> prepare('DELETE FROM client WHERE roomCode = ?');
$stmt -> bind_param('s', $_POST['roomCode']);
$stmt -> execute();

//Same as above, if we go into this if() then it didn't work
if($mysql -> affected_rows == 0){
    $response = ['status' => 'error',
                 'error' => 'Error removing users!'];
    $mysql->close();
    //Send response
    echo json_encode($response);
    return;
} else {
    //If we get here, then it all worked and we can return 'ok'
    $response = [
        'status' => 'ok'
    ];
    $mysql->close();
    //Send response
    echo json_encode($response);
    return;
}
?>