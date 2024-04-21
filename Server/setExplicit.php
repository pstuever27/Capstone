<?php

header('Access-Control-Allow-Origin: *'); //Uncomment for local testing

require_once ('require/error.php');

//Require mySQL php file
require_once ('require/sql.php');

//Connect to SQL
$mysql = SQLConnect();

//Set status to 'wait' until determination is made later
$status = 'wait';
$ex = 0;
if($_POST['username'] == 'true'){
  $ex = 1;
}

error_log($ex);

//increment and return votes
$updateExplicit = $mysql->prepare('UPDATE room SET explicit = ? WHERE roomCode = ?');
//Set parameter to 'roomCode' from JS call
$updateExplicit->bind_param('is', $ex, $_POST['roomCode']);

//Execute SQL 
$updateExplicit->execute();

//If we get here, then it all worked and we can return 'closed'
$response = [
  'status' => 'updated'
];
$mysql->close();
//Send response
echo json_encode($response);
return;
?>