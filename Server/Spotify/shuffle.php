<?php

/**
 * Prolouge
 * File: shuffle.php
 * Description: Handles shuffle script on host designation
 * Programmer's Name: Rylan DeGarmo
 * Date Created: February 17, 2024
 * Preconditions: 
 *  Requires Spotify PHP API from vendor and client_ID and client_secret to be set to the appropriate credentials from our Spotify Dev app.
 * Postconditions:
 *  @return : Returns spotify queue in json format or error
 * Error conditions: Returns error message if error occurs when trying to call getspotifyqueue vendor function
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/

 require '../../vendor/autoload.php';
 require '../require/sql.php';
 
 header('Access-Control-Allow-Origin: *'); //Uncomment for local testing
 
 //Get spotify app information from json (gitignore)
 $info = file_get_contents('../../client.json');
 $json = json_decode($info);
 
 //Create new session with our web app information
 $session = new SpotifyWebAPI\Session(
   $json->CLIENT_ID, //ClientID
   $json->CLIENT_SECRET, //Client Secret
 );
 
 // Open sql connection
 $mysql = SQLConnect();
 
 $status = 'wait';
 
 //Prepare statement to get the access token and refresh token
 $stmt = $mysql->prepare("SELECT accessToken, refreshToken FROM room WHERE roomCode = ?");
 $stmt->bind_param('s', $_POST['roomCode']);
 $stmt->execute(); //Execute sql
 
 $result = $stmt->get_result();
 $row = $result->fetch_assoc();
 $accessToken = $row["accessToken"];
 $refreshToken = $row["refreshToken"];
 
 //If we have a token, then set that as our current 
 if ($accessToken) {
   //Set the tokens as current in our session
   $session->setAccessToken($accessToken);
   $session->setRefreshToken($refreshToken);
 } else {
  //Otherwise, just use the refresh token and it'll auto-refresh in the api call
   $session->refreshAccessToken($refreshToken);
 }
 
 //Set to auto refresh if needed
 $options = [
   'auto_refresh' => true,
 ];
 
 //Set up API
 $api = new SpotifyWebAPI\SpotifyWebAPI($options, $session);
 
 try {
   //Get the queue
   $response = $api->getMyQueue();
   
 } catch (SpotifyWebAPI\SpotifyWebAPIException $e) { //If there's an error, send error response
   $response = [
     'status' => 'error',
     'error' => $e->getMessage()
   ];
 }
 
 echo json_encode($response);

?>