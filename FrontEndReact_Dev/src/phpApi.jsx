/**
 * Prolouge
 * File: phpApi.jsx
 * Description: Component that will use XMLHTTP requests to call our php files
 * Programmer's Name: Paul Stuever
 * Date Created: 11/5/2023
 * Date Revised: 11/5/2023 - Created file, won't integrate yet as things aren't working
 * Preconditions: 
 *  @inputs : php file name, arguments
 * Postconditions:
 *  @returns : returns (TBD)
 * Error conditions: If SQL server connection did not succeed, error out
 * Side effects: None
 * Invariants: None
 * Known Faults: May need restructuing with state variables to ensure data is working correctly
 * **/

import React from "react";
import { useState, useEffect } from 'react'

// usePHPAPI = () => {
     // use state stuff to set up some vars, ie response, loading, etc.
    //const makeRequest = async () => { … } // func to do da server request. 
    //return { makeRequest, … all the state vars you want };   }

//This sets up the state variables and returns the makeRequest function which executes the php call
const phpAPI = (phpUrl, roomCode, username) => {
    //Set up state variables
    const [url, setUrl] = useState(null);
    const [code, setCode] = useState(null);
    const [name, setName] = useState(null);

    //May not be needed 
    const [phpResponse, setResponse] = useState(null);

    //Const which actually makes the request
    const makeRequest = async () => {
        //Make a new xhr object
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `http://localhost:8000/Server/${url}.php`, true);
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
                    //Else, set the callback to the JSON response and return
                    else {
                        return response;
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
    }

    //May need to be changed later, but return the function and the state variables
    return { makeRequest, setUrl, setCode, setName};
}

export default phpAPI