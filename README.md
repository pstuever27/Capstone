# Capstone
EECS581/582 Capstone Project

[SongSync - Website Link](https://songsync.live)
---
#  Developer Documentation
## PhpAPI
### Overview
`PhpAPI` is our main function call to send/receive information from our php files. This information is strictly guest, room, and host information that gets pulled from the mySQL server. 
> Note: `PhpAPI` is only used for host/join type of info. `SpotifyAPI` is our interface to interact with our _Spotify-Specific_ php files.
### JS Implementation
Here is a small example of how one could call a php file called `test.php`. For the sake of this example, just assume that `test.php` just returns either `status == 'ok'`, or `status == 'error'`
```javascript
const exampleComponent = () => {

    let roomCode = "ABCD"; // This cannot be null, as it is needed for most (if not all) SQL queries
    let name = "testing"; // This could be the room name, or a guest's name. Can be null if the php file doesn't do anything with it.
    let phpAddress = "test"; // To choose your php file, just put the filename without ".php" on the end. PhpAPI will add that for you.

    const doRequest = () => {
      makeRequest(phpAddress, roomCode, name); // Calling makeRequest actually does the php request. After this, the phpResponse state variable below gets updated. 
    }

    // My recommendation is to have a useEffect that looks at phpAddress and if it updates, then act accordingly to what the response is.
    useEffect(() => {
      if(phpResponse.status == "ok") {
        // do stuff to handle a good return. This could include moving to another page, or displaying a message.
      }
      if(phpReseponse.status == "error"){
        // Error case. There is some error handling in phpAPI, but you may need to do extra stuff here for some cases
      }
    }, [phpResponse]);

    // Hook that grabs the makeRequest function and phpResponse state from phpAPI
    const { makeRequest, phpResponse } = phpAPI();

    return(
      <button onClick={ doRequest }>Click me!</button>
    );

}
export default exampleComponent

```
If you still need some examples, `splash.jsx` has some good ones:
  *[Example of using host.php](https://github.com/pstuever27/Capstone/blob/9bfa33a7876f139e5f328eb0409b7be911267b4c/FrontEndReact_Dev/src/pages/splash.jsx#L261)
  *[Example of using join.php](https://github.com/pstuever27/Capstone/blob/9bfa33a7876f139e5f328eb0409b7be911267b4c/FrontEndReact_Dev/src/pages/splash.jsx#L232)

### PHP Implementation
Let's say you need to create a new PHP file for a new SQL query. Here's a quick example of how you can do that. This PHP file is simply getting all the users in a room, and then returning an array of all the users if there is at least one user, and `status == "error"` if there are no users.
```php
<?php

require_once('./require/sql.php'); // This file is local, and just holds our mySQL login information. 

$mysql = SQLConnect(); // You have to create a mysql object to interact with the server

$status = 'wait'; // Not completely necessary but it's here in case we need it

$stmt = $mysql->prepare('SELECT userName FROM client WHERE roomCode = ?'); // I've been using dynamic queries. This allows us to put a '?' where the query info (roomCode, name, etc) goes, and then we can insert it later

$stmt->bind_param('s', $_POST['roomCode']); // Here is where we bind the roomCode to that '?'. To do multiple '?'s in a query, you would do $stmt->bind_param('ss', $_POST['roomCode'], $_POST['name']);
$stmt->execute(); // This executes the mySQL query 

$result = $stmt->get_result(); // Stores the returned information in $result. In this case, it's an array
$row = $result->fetch_assoc(); // fetch_assoc() gets the first row in a result. 

if(!$result || !$row) { // If there's no information in the array or the row, then it's an error
    $status = 'error';

    // Php typically returns a JSON object. Here's how you can make one for that using our status
    $response = [
        'status' => $status
    ];

    echo json_encode($response); // This is how you return the $response JSON object to javascript. 
    return;
}
else{
    $status = 'ok';
        $myArray[] = $row; // puts the information in an array...
    while($row = $result->fetch_assoc()) {
        $myArray[] = $row; // and iterates through the result to get all the guests in the room
    }
    echo json_encode($myArray); // Returns the array
}
exit(200); // This exit(200) is important because if you don't do it, then your php can keep running in the background and cause unintended side-effects
?>

```
Again, there are plenty of examples in our code. Namely, any of the php files in the [Server/ folder](https://github.com/pstuever27/Capstone/tree/9bfa33a7876f139e5f328eb0409b7be911267b4c/FrontEndReact_Dev/Server).
