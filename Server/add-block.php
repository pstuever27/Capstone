<?php

/**
 * Prolouge
 * File: block-list.php
 * Description: Handles PHP server functionality needed for displaying blocked songs information
 * Programmer's Name: Paul Stuever
 * Date Created: 1/4/2024 - Paul Stuever
 * Date Revised: 1/4/2024 - Paul Stuever - Created file and worked on block list functionality
 * Preconditions: 
 *  @inputs : Requires input from Javascript to do SQL query
 * Postconditions:
 *  @returns : Returns error/ok response based upon if there are guests.
 * Error conditions: If there's a SQL error, then it will be returned to the js 
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/

require_once('./require/sql.php');
header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

$mysql = SQLConnect();

$status = 'wait';

$stmt = $mysql->prepare('INSERT INTO blockList ("roomCode", "songID") VALUES (?, ?)');

$stmt->bind_param('ss', $_POST['roomCode'], $_POST['username']);
$stmt->execute();




?>