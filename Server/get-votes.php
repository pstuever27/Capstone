<?php
/**
 * Prolouge
 * File: get-votes.php
 * Description: Handles PHP server functionality needed for getting the current vote values and guest list for majority vote calculations from the SQL table
 * Programmer's Name: Kieran Delaney
 * Date Created: 2/24/2024
 * Date Revised: 3/24/2024 - Kieran Delaney - Was originally just get-skip-votes.php, but modified it in this revision to be more than just skipVotes, by also adding guest list for majority skip, and the pings of the guests for auto-removal of inactive guests. This one command will return all the data we need for managing votes in our app for various things. 
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : Returns JSON with skip votes value, guest list (including their usernames and ping values), and any future voting values from table encoded.
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
$skipVoteStmt = $mysql->prepare('SELECT skipVotes FROM room WHERE BINARY roomCode = ?');
$guests = $mysql->prepare('SELECT userName, ping FROM client WHERE roomCode = ?');
//Set parameter to 'roomCode' from JS call
$skipVoteStmt->bind_param('s', $_POST['roomCode']);
$guests->bind_param('s', $_POST['roomCode']);

//Execute SQL 
$skipVoteStmt->execute();
//Grab the result from the SQL query. this should hold the skipVotes array
$SkipVoteArr = $skipVoteStmt->get_result();
//Get the row 
$skipRow = mysqli_fetch_row($SkipVoteArr);
$SkipVoteArr->free_result();

$guests->execute();
$GuestsResult = $guests->get_result();
$GuestRow = $GuestsResult->fetch_assoc();


//If the row doesn't exist or there was no result, then the room doesn't exist. Error out
if (!$SkipVoteArr || !$skipRow) {
    //Set up JSON response
    $status = 'no-vote';
    $response = [
        'status' => $status,
        'error' => "SkipVotes Doesn't Exist!"
    ];
    //Send back an error response
    $mysql->close();
    echo json_encode($response);
    return;
}
//If the row exists...
else {
    //Set status to ok because we got a skipvotes value
    $status = 'ok';

    $guestList = []; //initilize to empty so that it can be accessible in response array even if no guests
    if($GuestRow){
        $guestList[] = $GuestRow; //this is needed for when only one guest, as the while loop won't execute
    }
    while($row = $GuestsResult->fetch_assoc()) {
        $guestList[] = $row;
    }

    //Set up JSON to respond with
    $response = [
        'skipVotes' => $skipRow, //gets the value from the skipVotes cell
        'guestList' => array($guestList),
        'status' => $status,
    ];
    
    $GuestsResult->free_result();

    $mysql->close();
    //Send response
    echo json_encode($response);
}

//Exit 200 indicates good exit
exit(200);


?>