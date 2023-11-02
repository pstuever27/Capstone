/**
 * Prolouge
 * File: main.js
 * Description: Handles all major javascript functionality for our server
 * Programmer's Name: Paul Stuever
 * Date Created: 9/20/2023
 * Date Revised: 10/07/2023
 *  Revision: 9/20/2023 - Paul Stuever - File created
 *  Revision: 9/21/2023 - Paul Stuever - Began work on php server integration
 *  Revision: 9/24/2023 - Paul Stuever - Finished preliminary php integration for room codes
 *  RevusuibL 10/05/2023 - Nicholas Nguyen - Finished implementing username functionality for clients
 *  Revision: 10/07/2023 - Rylan DeGarmo - Added partial functionality for Host/Join pages
 *  Revision: 10/08/2023 - Rylan DeGarmo - Finished adding functionality for Host/Join pages
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

//When room code is generated, display room code and corresponding message
const showCodeHost = (msg, code, username) => {
    localStorage.setItem('message', JSON.stringify(msg));
    localStorage.setItem('code', JSON.stringify(code));
    console.log( username );
    localStorage.setItem('hostName', JSON.stringify(username));
}

//When room code is entered, display room code and corresponding message
const showCodeJoin = (msg, code, username) => {
    localStorage['message'] = msg;
    localStorage['code'] = code;
    console.log( username );
    localStorage['username'] = username;
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
            console.log(xhr.responseText);
            //Response should have a JSON in it, if not, this will error out
            response = JSON.parse(xhr.responseText);
            //If error, then throw an error
            if (response.status === 'error') {
                throwError(response.error);
            }
            if (response.status === 'no-guests') {
                throwError("No Guests in the Room!");
            }
            //Else, set the callback to the JSON response and return
            else {
                callBack(response);
            }
        }
        catch (err) {
            //Catch whatever error was thrown. This also catches PHP errors to display them
            console.log(err);
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
    // prevent a client from creating a room without providing a name
    if((username = $('username').value) == "" )
    {
        throwError("Please provide a username.");
        return;
    }

    location.href="host.html"

    var roomCode = genCode();
    //Call host.php with roomcode. Get response JSON
    phpAPI('host', roomCode, "", (response) => {
        //If it's ok, then PHP indicates the roomcode is good and redirects to host page
        if (response.status === 'ok') {
            showCodeHost("Room Generated!", roomCode, username);

            location.href="host.html";
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
        //If the room is found, then open join room display roomCode. If not, PHP will show error in phpAPI 
        if( response.status === 'ok' ) {
            showCodeJoin("Room Found!", roomCode, username);
            location.href="join.html";
        }
    });
};

//Function checks if there are guests in the room, and updates the list accordingly
function checkGuests() {
    //Get roomCode from localstorage
    let code = localStorage.getItem('code');
    //Get the hostname from localstorage
    let hostName = localStorage.getItem('hostName');
    //Call phpApi with guest-list.php as the url
    phpAPI('guest-list', code, hostName, (response) => {
            //Grabs the div containing the list of guests
            const listDiv = document.getElementById('guest-list-guests');
            //If we have no error return from php...
            if(response.status != 'error') {
                //Go through the div and remove everything
                while(listDiv.firstChild) {
                        listDiv.removeChild(listDiv.firstChild);
                }
                //Now, for each userName we get back
                response.forEach(element => {
                    //Make a new p element
                    var p = document.createElement('p');
                    var text = document.createTextNode(element.userName);
                    p.appendChild(text);
                    //Add it to the div
                    listDiv.appendChild(p);
                });
                //Since there are guests, check every 5000 seconds to keep updated
                setInterval(function() {
                    checkGuests();
                }, 5000);
            }
        });
};

//Const function to begin checking for guests
const guestList = () => {
    const buttonElem = document.getElementById('guest-list-guests');
    //Determine if our list is being shown right now
    var listShown = buttonElem.classList.contains('show');
    //Call helper function
    checkGuests();
    //Update button text depending on whether the list is shown or not
    if(listShown) {
        var buttonText = 'Show Guest List';
        //Hide the list
        buttonElem.classList.remove('show');
        //Hide kick menu
        document.getElementById('kick').classList.remove('show');
    }
    else {
        var buttonText = 'Hide Guest List';
        //Show the list
        buttonElem.classList.add('show');
        //Show kick menu
        document.getElementById('kick').classList.add('show');
    }
    //Update the button text
    $('guest-button').innerText = buttonText;
};

//Const function to close the room
const closeRoom = () => {
    //Get the code and hostName from localstorage
    let code = localStorage.getItem('code');
    let hostName = localStorage.getItem('hostName');
    //Call the php api 
    phpAPI('close-room', code, hostName, (response) => {
        //If we get an error then it didn't work
        if(response.status != 'error') {
            throwError(response.error);
        } else {
            //Otherwise, redirect back to index.html
            location.replace('index.html');
        }
    });
    location.replace('index.html');
};

//Const function to kick guest
const kickGuest = () => {

};

//When load window refreshes, load localStorage information
const LoadJoin = () => {
    //$('code-box-join-message').innerText = localStorage.getItem('message');
    $('code-box-join-message').innerText = 'Test';
    $('code-box-join-code').innerText = localStorage.getItem('code');
    $('code-box-join-username').innerText = localStorage.getItem('username');

    //$('code-box-host-message').innerText = localStorage.getItem('message');
    $('code-box-host-message').innerText = "Test";
    $('code-box-host-code').innerText = localStorage.getItem('code');
    $('code-box-host-username').innerText = localStorage.getItem('username');
}

//When host window refreshes, load localStorage information
function LoadHost() {
    let message = localStorage.getItem('message')
    let code = localStorage.getItem('code')
    let hostName = localStorage.getItem('hostName')
    guestList;

    $('code-box-host-message').innerText = message;
    //$('code-box-host-message').innerText = "Test";
    $('code-box-host-code').innerText = code;
    $('code-box-host-username').innerText = hostName;
    $('guest-button').addEventListener('click', guestList);
    $('close-room').addEventListener('click', closeRoom);
}

//When the window refreshes
window.onload = async () => {

    //Listen for host or join button and call corresponding function
    $('host-button').addEventListener('click', host);
    $('join-button').addEventListener('click', join);

    //load join and host pages
    $('code-box-join').addEventListener('load', LoadJoin);
    $('code-box-host').addEventListener('load', LoadHost);
};