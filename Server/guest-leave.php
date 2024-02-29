<?php

/**
 * Prolouge
 * File: guest-leave.php
 * Description: Handles PHP server functionality needed for removing a guest from the room when they leave
 * Programmer's Name: Kieran
 * Date Created: 02/29/2023
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : Returns error/ok response based upon if the guest can be removed.
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

$id = $_POST['roomCode'] . '_' . $_POST['username'];
//prepare, bind, and execute mySQL query. we pass in the id as the roomcode_username format into the username parameter for PHPapi's makerequest (the call is made in login.jsx)
$stmt = $mysql -> prepare('DELETE FROM client WHERE id = ?');
$stmt -> bind_param('s', $id);
$stmt->execute();

//If we get here, then it all worked and we can return 'guest-exited'
$response = [
    'status' => 'guest-exited'
];
$mysql->close(); //important for closing the connection in case it would possibly try to remain connected after the user was deleted
//Send response
echo json_encode($response);
return;
?>