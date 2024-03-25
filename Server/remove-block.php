<?php
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
$stmt = $mysql->prepare('DELETE FROM blockList WHERE roomCode = ? AND name = ?');
$stmt->bind_param('ss', $_POST['roomCode'], $_POST['username']);
$stmt->execute();

echo "here";

//If we get here, then it all worked and we can return 'ok'
$response = [
'status' => 'ok'
];
$mysql->close();
//Send response
echo json_encode($response);
return;
?>