/**
 * Prolouge
 * File: phpApi.jsx
 * Description: Component that will use XMLHTTP requests to call our php files
 * Programmer's Name: Paul Stuever
 * Date Created: 11/5/2023
 * Date Revised: 11/5/2023 - Paul Stuever - Created file, won't integrate yet as things aren't working
 * Date Revised: 11/17/2023 - Paul Stuever - Updated phpApi to return makeRequest for use in components. Working now.
 * Date Revised: 2/29/2024 - Kieran Delaney - Added guests who click leave button to the condition for redirecting them back to splash screen.
 * Preconditions: 
 *  @inputs : php file name, arguments
 * Postconditions:
 *  @returns : returns (TBD)
 * Error conditions: If SQL server connection did not succeed, error out
 * Side effects: None
 * Invariants: None
 * Known Faults: None
 * **/

import { useState } from 'react'
import { useSelector } from 'react-redux'

// usePHPAPI = () => {
     // use state stuff to set up some vars, ie response, loading, etc.
    //const makeRequest = async () => { … } // func to do da server request. 
    //return { makeRequest, … all the state vars you want };   }

function throwError(error) {
    console.log(error);
}

//This sets up the state variables and returns the makeRequest function which executes the php call
const phpAPI = () => {

    //Get server address based on build type
    const { serverAddress } = useSelector(store => store.serverAddress );

    //Set up state variable
    const [phpResponse, setResponse] = useState(null);

    //Const which actually makes the request
    const makeRequest = (phpUrl, roomCode, username) => {
        //Make a new xhr object

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${serverAddress}/Server/${phpUrl}.php`, true);
        //Open the PHP file
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        //When the PHP file is done, this will get called
        xhr.onreadystatechange = () => {
            //4 or 200 indicates good exit and return
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response;
                //try/catch if JSON works
                try {
                    // console.log(xhr.responseText);
                    //Response should have a JSON in it, if not, this will error out
                    response = JSON.parse(xhr.responseText);
                    //If error, then throw an error
                    if (response.status === 'error') {
                        throwError(response.error);
                    }
                    if (response.status === 'no-guests') {
                        throwError("No Guests in the Room!");
                    }
                    if (response.status === 'closed' || response.status === 'guest-exited') {
                        window.location.href = '/';
                    }
                    //Else, set the callback to the JSON response and return
                    else {
                        console.log(response);
                        setResponse(response);
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
    }


    //May need to be changed later, but return the function and the state variables
    return { makeRequest, phpResponse };
}

export default phpAPI