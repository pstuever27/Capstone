<?php
header('Access-Control-Allow-Origin: *'); //Uncomment for local testing


require_once('require/error.php');

//Require mySQL php file
require_once('require/sql.php');

//Connect to SQL
$mysql = SQLConnect();

//Set status to 'wait' until determination is made later
$status = 'wait';

function unIsUnique()
{ //open curly
  global $mysql;
  //Check if the username exists
  $un_prepare = $mysql->prepare('SELECT username FROM client WHERE BINARY username = ? AND roomCode = ?');

  //Set parameter to 'username' & roomcode from JS call
  $un_prepare->bind_param('ss', $_POST['username'], $_POST['roomCode']);
  $un_prepare->execute();

  //"if the username is unique relative to the room"
  if ($un_prepare->get_result()->num_rows == 0) {
    //id is [roomcode]_[username] for each client
    $id = $_POST['roomCode'] . '_' . $_POST['username'];
    //check if the ID exists
    $un_insert = $mysql->prepare('INSERT INTO client (username, roomCode, id) VALUES (?, ?, ?)');
    //set parameter to 'username', 'roomCode' & 'id'
    $un_insert->bind_param('sss', $_POST['username'], $_POST['roomCode'], $id);
    $un_insert->execute();

    //return the username
    return $_POST['username'];
  }

  //"if the username is not unique relative to the room"
  else {
    //return null value, error catch in caller
    return null;
  }
}

$username = unIsUnique();

//if the username is unique (relative to the room)
if ($username != null) {
  //Grab the roomCode
  $status = 'good_name';

  $response = [
    'status' => $status
  ];

}
else {
  $response = [
    'status' => 'error',
    'error' => 'Username already taken'
  ];
}

$mysql->close();
echo json_encode($response);

exit(200);

?>