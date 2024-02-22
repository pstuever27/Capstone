# Capstone
EECS581/582 Capstone Project

[SongSync - Website Link](https://songsync.live)
---
#  Developer Documentation

## How to run this prototype
1. Clone this repo
2. Install `node` and `npm` if it's not already installed, using the install commands specific to your terminal / OS.
3. Use the command `npm ci` to do a clean install of the Vite and React dependencies for this prototype.
> You may need to run `npm ci --legacy-peer-deps` if there are issues
4. Put the client ID/secret of the spotify developer app in the client_secret.json file. If you have your own spotify developer app, you can use your own clientID and clientSecret.
5. Use the command `npm run dev` to run the app. It'll route to [http://localhost:3000](http://localhost:3000)
6. Open another terminal in the Capstone directory
7. Run `php -S localhost:8000` to start your php server


## PhpAPI
### Overview
`PhpAPI` is our main function call to send/receive information from our php files. This information is strictly guest, room, and host information that gets pulled from the mySQL server. 
> Note: `PhpAPI` is only used for host/join type of info. `SpotifyAPI` is our interface to interact with our _Spotify-Specific_ php files.
### Common Fixes
When attempting to run our project and use php functions, you may run into any number of issues. Most of these can be narrowed down to 3 or 4 things you may need to do. Here is a list of common errors and how to fix them.
> Note: When you run into an issue, it's always helpful to check both the browser console (F12), and the php server console window for errors.
> ALSO: This project is best run in WSL on Windows. It is also possible to run on macOS but a homebrew installation of php is required. Windows is uncharted territory and doesn't work.
1. **CURLUPT_CAINFO / CURL / SpotifyWebAPI\Request->send() / SpotifyWebApi\CURLOPT_CAINFO**
   If you see an error in your Vite console similar to: `SpotifyWebAPI\Request->send()` or `SpotifyWebApi\CURLOPT_CAINFO`, you need to install curl, and not just any curl...phpCurl.
   Run the command below to install phpCurl:
   ```sudo apt-get install php8.1-curl```
2. **Unable to load dynamic library MYSQL**
   Seeing this error is similar to phpCurl in issue #1, you need to install phpMySQL.
   Run the command below to install phpMySQL:
   ```sudo apt-get install php8.1-mysql```
3. **MYSQL: Access Denied**
   This error indicates that you have not added your IP to the Hostinger mySQL whitelist. Here's how to add it:
   1. Log into Hostinger, open your Home, and under the Hosting tab click *Manage* next to **Single Web Hosting**.
   2. On the left-hand sidebar, dropdown the **Databases** tab and click *Remote MySQL*.
   3. Now, keeping that window open, go to [whatsmyip.org](https://www.whatsmyip.org/) and copy your IPv4 address
   4. Finally, put that address into the Remote MySQL input box and click *Create*
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