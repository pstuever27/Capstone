<?php
/**
 * Prolouge
 * File: host-name.php
 * Description: This php file queries the mySQL server for inserting the name of a host's room
 *              
 * Programmer(s): Paul Stuever
 * Date Created: 11/17/2023
 * 
 * Date Revised: 11/17/2023 - File created and php functionality working
 * 
 * Preconditions: 
 *  @inputs : None 
 * Postconditions:
 *  @returns : 
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/


header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

 //Use the sql.php file
require_once('./require/sql.php');

//Connect to SQL
$mysql = SQLConnect();

//Status to wait
$status = 'wait';

//Add roomCode to the database if it doesn't already exist
$stmt = $mysql->prepare("UPDATE room SET roomName = ? WHERE roomCode = ?");
//Set roomCode to param
$stmt->bind_param('ss', $_POST['username'], $_POST['roomCode']);

//Execute the SQL
$stmt->execute();

// This specific status is used to indicate that the host name was inserted
$status = "good_host_name";

$response = [
    'status' => $status
];

//Send response
echo json_encode($response);
exit(200);

?>