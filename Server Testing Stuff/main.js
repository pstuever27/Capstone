/**
 * Prolouge
 * File: main.js
 * Description: Handles all major javascript functionality for our server
 * Programmer's Name: Paul Stuever
 * Date Created: 9/20/2023
 * Date Revised: 10/05/2023
 *  Revision: 9/20/2023 - Paul Stuever - File created
 *  Revision: 9/21/2023 - Paul Stuever - Began work on php server integration
 *  Revision: 9/24/2023 - Paul Stuever - Finished preliminary php integration for room codes
 *  RevusuibL 10/05/2023 - Nicholas Nguyen - Finished implementing username functionality for clients
 *  
 * Preconditions:
 *  @inputs : Will take input from index.html for user input such as room code, or code generation
 * Postconditions:
 *  @returns : Sets innerhtml for index.html elements to display information to user such as room code
 * Error conditions: 
 *  @error : If the user inputs an incorrect room code, it will display an error
 *  @error : If there's an internal PHP error, it will display
 * Side effects: None
 * Invariants: None
 * Known Faults: Will require more error handling when new features are added
 * **/

//Globals to be used later for session handling, unused for now
const globals = {
    errorTimeout: -1,
    username: null,
    roomCode: null,
    id: null
};

//JQuery setup
const $ = (id) => document.getElementById(id);

//Hides the 'error' div when necessary
const hideError = () => {
    $('error').classList.remove('show');
};

//Shows the 'error' div and displays the corresponding message in the box
const throwError = (msg) => {
    $('error-message').innerText = msg;
    $('error').classList.add('show');
    //After 5000ms, hide the error message
    window.setTimeout(hideError, 5000);
};

//Similar to error div, hide the 'code-box' div 
const hideCode = () => {
    $('code-box').classList.remove('show');
}

//When room code is generated or entered, display room code and corresponding message
const showCode = (msg, code, username) => {
    $('code-box-message').innerText = msg;
    $('code-box-code').innerText = code;
    console.log( username );
    $('code-box-username').innerText = username;
    $('code-box').classList.add('show');
    //Hide after 10 seconds, will need to be static later
    window.setTimeout(hideCode, 3000);
}

//Set up PHP calls 
const phpAPI = (url, roomCode, username, callBack) => {
    //Will update later with real functionality, just need to make sure server calls work for now.

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `Server/${url}.php`, true);
    //Open the PHP file
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //When the PHP file is done, this will get called
    xhr.onreadystatechange = () => {
        //4 or 200 indicates good exit and return
    if (xhr.readyState === 4 && xhr.status === 200) {
        let response;
        //try/catch if JSON works
        try {
            //Response should have a JSON in it, if not, this will error out
            response = JSON.parse(xhr.responseText);
            //If error, then throw an error
            if (response.status === 'error') {
                throwError(response.error);
            }
            //Else, set the callback to the JSON response and return
            else {
                callBack(response);
            }
        }
        catch (err) {
            //Catch whatever error was thrown. This also catches PHP errors to display them
            throwError(err);
        }
    }
    };
    //Send the roomcode and username to PHP file
    xhr.send('roomCode=' + roomCode + '&username=' + username);
};

//Generate a roomcode by random 
const genCode = () => {
    // Game Code Generation ~~~~~~~~
    //We have opted to only use uppercase letters and numbers
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    var code = '';
    //Random choose loop
    for (var i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
};

//When host button is clicked, call this
const host = () => {
    var roomCode = genCode();
    //Call host.php with roomcode. Get response JSON
    phpAPI('host', roomCode, "", (response) => {
        //If it's ok, then PHP indicates the roomcode is good
        if (response.status === 'ok') {
            showCode("Room Generated!", roomCode, "");
        }
        else {
            //If that roomcode is already taken, then generate another one.
            //Call host again 
            host();
        }
    });

    return;
};

//When join button is clicked, call this
const join = () => {
    // prevent a client from joining a room without providing a name
    if((username = $('username').value) == "" )
    {
        throwError("Please provide a username.");
        return;
    }

    //Regex to test preliminary roomCode entry
    const regex = /^[A-Z0-9]+$/;
    //Gets room-code from html
    const roomCodeInput = $('room-code');
    //Gets exact value
    const roomCode = roomCodeInput.value;
    //Test code against regex
    if(roomCode.length != 4 || !regex.test(roomCode)) {
        throwError("Invalid Room Code!");
        return;
    }
    //If regex good, then call PHP
    console.log( username );
    phpAPI('join', roomCode, username, (response) => {
        //If the room is found, then display roomCode. If not, PHP will show error in phpAPI 
        if( response.status === 'ok' ) {
            showCode("Room Found!", roomCode, username)
        }
    });
};

//When the window refreshes
window.onload = async () => {

    //Listen for host or join button and call corresponding function
    $('host-button').addEventListener('click', host);
    $('join-button').addEventListener('click', join);
};