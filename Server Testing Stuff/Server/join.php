<?php
/**
 * Prolouge
 * File: join.php
 * Description: Handles PHP server functionality needed for checking if a room code exists
 * Programmer's Name: Paul Stuever
 * Date Created: 9/21/2023 
 * Date Revised: 9/24/2023 - Paul Stuever - Finished php set up for room codes
 *  Revision: 9/21/2023 - Paul Stuever - File created
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : If room code is found, return JSON with data encoded. If not, return error JSON
 * Error conditions: If roomcode is not found, return error. Other internal error may return error case 
 * Side effects: None
 * Invariants: None
 * Known Faults: Requires more error handling for edge cases
 * **/
//Require error handling
require_once('require/error.php');
//Require mySQL php file
require_once('require/sql.php');
//Connect to SQL
$mysql = SQLConnect();
//Set status to 'wait' until determination is made later
$status = 'wait';

//Check if the gamecode exists
$stmt = $mysql -> prepare('SELECT roomCode FROM room WHERE BINARY roomCode = ?');
//Set parameter to 'roomCode' from JS call
$stmt -> bind_param('s', $_POST['roomCode']);
//Execute SQL 
$stmt -> execute();

//Grab the result from the SQL query
$result = $stmt -> get_result();
//Get the row 
$row = mysqli_fetch_row($result);

//If the row doesn't exist or there was no result, then the room doesn't exist. Error out
if(!$result || !$row) {
    //Set up JSON response
    $status = 'error';
    $response = ['status' => $status, 
                 'error' => "Room Doesn't Exist!"    
                ];
    //Send back an error response
    echo json_encode($response);
    return;
}
//If the row exists...
else {
    //Grab the roomCode
    $roomCode = $row[0];
    //Set status to OK
    $status = 'ok';
    //Set up JSON to respond with
    $response = [
        'roomCode' => $roomCode,
        'status' => $status
    ];
    //Close SQL connection
    $mysql->close();
    //Send response
    echo json_encode($response);
}
//Exit 200 indicates good exit
exit(200);

?>
