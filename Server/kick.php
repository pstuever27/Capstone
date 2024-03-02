<?php

/**
 * Prolouge
 * File: kick.php
 * Description: Handles PHP server functionality needed for kicking a user
 * Programmer's Name: Paul Stuever
 * Date Created: 3/1/2024 - Paul Stuever
 * 
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : Returns error/ok response based upon if the room could be closed.
 * Error conditions: If there's a SQL error, then it will be returned to the js 
 * Side effects: None
 * Invariants: None
 * Known Faults: Requires more error handling for edge cases, SQL seems to have issues with deletion
 * **/

//Add simple sql error handling
require_once('require/error.php');
//mySQL framework
require_once('require/sql.php');
mysqli_report(MYSQLI_REPORT_STRICT); // Tried to figure out errors in mySQL. Hasn't resulted to much
header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

//Display errors 
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

//Connect to SQL
$mysql = SQLConnect();

//Uncomment for connection error testing
// echo $mysql->connect_errno;

//Set status to 'wait' until determination is made later
$status = 'wait';

//prepare, bind, and execute mySQL query
$stmt = $mysql->prepare('DELETE FROM client WHERE roomCode = ? AND userName = ?');
$stmt->bind_param('ss', $_POST['roomCode'], $_POST['username']);
$stmt->execute();

//If we get here, then it all worked and we can return 'ok'
$response = [
  'status' => 'ok'
];
$mysql->close();
//Send response
echo json_encode($response);
return;
?>