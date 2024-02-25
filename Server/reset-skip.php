<?php
/**
 * Prolouge
 * File: reset-skip.php
 * Description: Handles PHP server functionality needed for resetting the skipVotes table value to 0, important for making sure the votes from one track aren't carried over to the next song playing
 * Programmer's Name: Kieran Delaney
 * Date Created: 2/24/2024
 * Date Revised: 2/24/2024
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : Returns status after successfully running command.
 * Error conditions: None.
 * Side effects: None
 * Invariants: None
 * Known Faults: Requires more error handling for edge cases
 * **/
header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

require_once('require/error.php');

//Require mySQL php file
require_once('require/sql.php');

//Connect to SQL
$mysql = SQLConnect();

//Set status to 'wait' until determination is made later
$status = 'wait';

//Check if the gamecode exists
$stmt = $mysql->prepare('UPDATE room SET skipVotes = 0 WHERE BINARY roomCode = ?');
//Set parameter to 'roomCode' from JS call
$stmt->bind_param('s', $_POST['roomCode']);

//Execute SQL 
$stmt->execute();

// This specific status is used to indicate that the votes were incremented successfully
$status = "votes_reset";
$response = [
    'status' => $status
];

//Send response
echo json_encode($response);

//Exit 200 indicates good exit
exit(200);


?>