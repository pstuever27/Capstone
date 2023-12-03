<?php
    //Plans for the future of the file include checking if the token is still valid, and refreshing/storing automatically.
    $path = '../../client.json';
    $jsonString = file_get_contents($path);
    $jsonData = json_decode($jsonString, true);
    //Plan to make this file main interface for refreshing tokens
    $session = new SpotifyWebAPI\Session(
        $jsonData.CLIENT_ID,
        $jsonData.CLIENT_SECRET
    );

    $session->requestCredentialsToken();
    $accessToken = $session->getAccessToken();

    echo($accessToken);
?>