<?php
/**
 * Prolouge
 * File: get-skip-votes.php
 * Description: Handles PHP server functionality needed for getting the current skip vote value from the SQL table
 * Programmer's Name: Kieran Delaney
 * Date Created: 2/24/2024
 * Date Revised: 2/24/2024
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : Returns JSON with skip votes value from table encoded.
 * Error conditions: If the skipvotes isn't available from the table for whatever reason, we will error out.
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
$stmt = $mysql->prepare('SELECT skipVotes FROM room WHERE BINARY roomCode = ?');
//Set parameter to 'roomCode' from JS call
$stmt->bind_param('s', $_POST['roomCode']);

//Execute SQL 
$stmt->execute();

//Grab the result from the SQL query. this should hold the skipVotes array
$result = $stmt->get_result();

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
    $mysql->close();
    echo json_encode($response);
    return;
}
//If the row exists...
else {
    //Set status to ok because we got a skipvotes value
    $status = 'ok';

    //Set up JSON to respond with
    $response = [
        'skipVotes' => $row, //gets the value from the skipVotes cell
        'status' => $status,
    ];

    $mysql->close();

    //Send response
    echo json_encode($response);
}

//Exit 200 indicates good exit
exit(200);


?>