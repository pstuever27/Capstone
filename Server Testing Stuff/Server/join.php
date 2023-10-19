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
{ //open curly
    global $mysql;    
    //Check if the username exists
    $un_prepare = $mysql->prepare('SELECT username FROM client WHERE BINARY username = ? AND roomCode = ?');

    //Set parameter to 'username' & roomcode from JS call
    $un_prepare -> bind_param('ss', $_POST['username'], $_POST['roomCode']);
    $un_prepare -> execute();

    //"if the username is unique relative to the room"
    if( $un_prepare->get_result()->num_rows == 0 )
    {
        //id is [roomcode]_[username] for each client
        $id = $_POST['roomCode'].'_'.$_POST['username'];
        //check if the ID exists
        $un_insert = $mysql->prepare('INSERT INTO client (username, roomCode, id) VALUES (?, ?, ?)');
        //set parameter to 'username', 'roomCode' & 'id'
        $un_insert->bind_param('sss', $_POST['username'], $_POST['roomCode'], $id);
        $un_insert->execute();

        //return the username
        return $_POST['username']; 
    }

    //"if the username is not unique relative to the room"
    else{
        //return null value, error catch in caller
        return null;
    }
}

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
    // $username is assigned a value if it is unique, otherwise it is assigned null
    $username = unIsUnique();

    //if the username is unique (relative to the room)
    if( $username != null)
    {
        //Grab the roomCode
        $username = $_POST['username'];
        $roomCode = $_POST['roomCode'];

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

    //otherwise, the username is already taken (prompt for a new one)
    else
    {
        //set status to error
        $status = 'error';

        //set up JSON to respond with
        $response = ['status' => $status,
                     'error' => "username already taken" ];
    }
    //Send response
    echo json_encode($response);
}

//Exit 200 indicates good exit
exit(200);

?>
