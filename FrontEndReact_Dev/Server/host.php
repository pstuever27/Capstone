<?php
/**
 * Prolouge
 * File: host.php
 * Description: Handles PHP server functionality needed for checking if a room code exists and inserting codes to SQL DB
 * Programmer's Name: Paul Stuever
 * Date Created: 9/21/2023 
 * Date Revised: 9/24/2023 - Paul Stuever - Finished php set up for room codes
 *  Revision: 11/5/2023 - Paul Stuever - Integrate into React frontend 
 *  Revision: 10/22/2023 - Paul Stuever - Added mySQL close for debugging
 *  Revision: 9/21/2023 - Paul Stuever - Continued server work for room codes
 *  Revision: 9/20/2023 - Paul Stuever - File Created
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : If room code is sucessfully input, return OK status. If not, return error JSON
 * Error conditions: If roomcode is found, return error. Other internal error may return error case 
 * Side effects: None
 * Invariants: None
 * Known Faults: Requires more error handling for edge cases
 * **/

header('Access-Control-Allow-Origin: http://localhost:3000'); //Uncomment for local testing

 //Use the sql.php file
require_once('./require/sql.php');

//Connect to SQL
$mysql = SQLConnect();

//Status to wait
$status = 'wait';

//Add roomCode to the database if it doesn't already exist
$stmt = $mysql->prepare('SELECT roomName FROM room WHERE BINARY roomCode = ?');
//Set roomCode to param
$stmt->bind_param('s', $_POST['roomCode']);

//Execute the SQL
$stmt->execute();

//Get the SQL result
$result = $stmt->get_result();
//Get the SQL result row
$row = mysqli_fetch_row($result);

$response = [
    'status' => 'ok',
    'roomName' => $row[0]
];

echo json_encode($response);  
exit(200);

// //If there's no result or row, then the code is unique
// if (!$result || !$row) {
//   //Insert the code into the DB
//   $nextStmt = $mysql->prepare('INSERT INTO room (roomCode) VALUES (?)');

//   //Set roomCode to param
//   $nextStmt->bind_param('s', $_POST['roomCode']);
//   //Execute SQL
//   $nextStmt->execute();
//   //Encode JSON response
//   $status = 'ok';
//   $response = [
//     'status' => $status
//   ];
//   //Close connection
//   $mysql->close();
//   //Send response and exit OK
//   echo json_encode($response);
//   exit(200);
// }
// else {
//   //If roomcode is found, then error out
//   $status = 'error';

//   $response = [
//     'status' => $status
//   ];
//   //Send error response
//   $mysql->close();
//   echo json_encode($response);
//   return;
// }
?>