<?php
/**
 * Prolouge
 * File: sql.php
 * Description: Handles mySQL server authentication
 * Programmer's Name: Paul Stuever
 * Date Created: 9/21/2023 
 * Date Revised: 9/21/2023 - Paul Stuever - File created, began server setup
 * Preconditions: 
 *  @inputs : None
 * Postconditions:
 *  @returns : returns mysqli object
 * Error conditions: If SQL server connection did not succeed, error out
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/
function SQLConnect() {
  //Create mysqli object with authentication information encoded
  $sql = new mysqli("62.72.50.204", "u394330643_songsync", 'o~9>@Kxd4UF9pVzpKi#Z$', 'u394330643_database');
  //Throw error if connection didn't work
  if($sql -> connect_errno) {
    throw new Exception("MySQL database: Connection Failed");
  }
  //Otherwise, return the sql object
  return $sql;
}
?>