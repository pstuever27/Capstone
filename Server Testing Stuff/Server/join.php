<?php
/**
 * Prolouge
 * File: join.php
 * Description: Handles PHP server functionality needed for checking if a room code exists
 * Programmer's Name: Paul Stuever
 * Date Created: 9/21/2023 
 * Date Revised: 10/05/2023 – Nicholas Nguyen – added client username functionality
 *  Revision: 9/24/2023 - Paul Stuever - Finished php set up for room codes
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

function unIsUnique()
{
    // echo 'poop3';
    global $mysql;
    //Check if the username exists
    $unStmt = $mysql -> prepare('SELECT username FROM client WHERE BINARY username = ? AND roomCode = ?');
    // echo 'poop4';
    //Set parameter to 'username' & roomcode from JS call
    $unStmt -> bind_param('ss', $_POST['username'], $_POST['roomCode']);
    $unStmt -> execute();

    $unResult = $unStmt -> get_result();
    echo $_POST['username'];
    echo $unResult->num_rows > 0;
    // echo 'poop5';
    print( $unResult )[0];
    return mysqli_fetch_row($unResult)[0]; //return the username
}

//If the row doesn't exist or there was no result, hen the room doesn't exist. Error out
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
    // echo 'poop1';
    //if the username is unique (relative to the room)
    if(($username = unIsUnique()) != null)
    {
        // echo 'poop2';
        //Grab the roomCode
        $roomCode = $row[0];
        $username = $_POST['username'];
        //Set status to OK
        $status = 'ok';
        //Set up JSON to respond with
        $response = [
            'roomCode' => $roomCode,
            'status' => $status,
            'username' => $username
        ];
        //Close SQL connection
        

        $mysql->close();

    }
    //otherwise, the username is already taken–prompt for a new one
    else
    {
        $status = 'error';
        $response = ['status' => $status,
                     'error' => "username already taken" ];
    }
    //Send response
    echo json_encode($response);
}
//Exit 200 indicates good exit
exit(200);

?>
