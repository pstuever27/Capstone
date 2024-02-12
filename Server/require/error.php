<?php
/**
 * Prolouge
 * File: error.php
 * Description: Simple file to handle PHP errors
 * Programmer's Name: Paul Stuever
 * Date Created: 9/20/2023 
 * Date Revised: 9/20/2023 - Paul Stuever - File created
 *     Revision: 9/21/2023 - Paul Stuever - Fixed files for server testing
 *     Revision: 11/5/2023 - Paul Stuever - Integrate into React frontend 
 * Preconditions: 
 *  @inputs : Requires input from php file when error is thrown
 * Postconditions:
 *  @returns : Error JSON
 * Error conditions: If this is called, then an error has occurred
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/
function errorResponse($e) {
    //Return the error JSON
    return json_encode([
        'status' => 'error',
        'error' => $e
    ]);
}
?>