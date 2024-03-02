<?php
/**
 * Prolouge
 * File: room.php
 * Description: Handles PHP server functionality needed for checking if a room is still open
 * Programmer's Name: Paul Stuever
 * Date Created: 2/24/2024
 * Date Revised: 2/24/2024
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : If room code is found, return JSON with data encoded. If not, return error JSON
 * Error conditions: If roomcode is not found, return error. Other internal error may return error case 
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
$stmt = $mysql->prepare('SELECT id FROM client WHERE userName = ? AND roomCode = ?');
//Set parameter to 'roomCode' from JS call
$stmt->bind_param('ss', $_POST['username'], $_POST['roomCode']);

//Execute SQL 
$stmt->execute();

//Grab the result from the SQL query
$result = $stmt->get_result();

//Get the row 
$row = mysqli_fetch_row($result);


//If the row doesn't exist or there was no result, then the room doesn't exist. Error out
if (!$result || !$row) {
    //Set up JSON response
    $status = 'closed';
    $response = [
        'status' => $status,
        'error' => "Room Doesn't Exist!"
    ];
    //Send back an error response
    $result->free_result();
    echo json_encode($response);
    return;
}
//If the row exists...
else {
    //Grab the roomCode
    $roomCode = $_POST['roomCode'];

    //Set status to good_name
    $status = 'open';

    //Set up JSON to respond with
    $response = [
        'roomCode' => $roomCode,
        'status' => $status,
    ];

    //Send response
    echo json_encode($response);
}

//Exit 200 indicates good exit
exit(200);


?>