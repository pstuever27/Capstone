<?php
/**
 * Prolouge
 * File: vote-skip.php
 * Description: Handles PHP server functionality needed for incrementing the skipVotes table value
 * Programmer's Name: Kieran Delaney
 * Date Created: 2/24/2024
 *  Revision: 3/10/2024 - Kieran Delaney - Added functionality to return the updated skipVotes value within this same call to optimize our SQL connections
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

//increment and return votes
$updateVotes = $mysql->prepare('UPDATE room SET skipVotes = skipVotes + 1 WHERE BINARY roomCode = ?');
$returnVotes = $mysql->prepare('SELECT skipVotes FROM room WHERE BINARY roomCode = ?');
//Set parameter to 'roomCode' from JS call
$updateVotes->bind_param('s', $_POST['roomCode']);
$returnVotes->bind_param('s', $_POST['roomCode']);

//Execute SQL 
$updateVotes->execute();
$returnVotes->execute();

//Grab the result from the SQL query. this should hold the skipVotes array
$result = $returnVotes->get_result();

//Get the row 
$row = mysqli_fetch_row($result);

//If the row doesn't exist or there was no result, then the room doesn't exist. Error out
if (!$result || !$row) {
    //Set up JSON response
    $status = 'no-vote';
    $response = [
        'status' => $status,
        'error' => "SkipVotes Doesn't Exist!"
    ];
    //Send back an error response
    $result->free_result();
    echo json_encode($response);
    return;
}
//If the row exists...
else {
    // This specific status is used to indicate that the votes were incremented successfully
    $status = 'vote_added';

    //Set up JSON to respond with
    $response = [
        'skipVotes' => $row, //gets the value from the skipVotes cell
        'status' => $status,
    ];

    //Send response
    echo json_encode($response);
}

//Exit 200 indicates good exit
exit(200);


?>