//--------------------------------
// File: authorizationApi.jsx (derived from App.jsx)
// Description: This react component interfaces between our react frontend components and our backend of spotify php calls. 
// Programmer(s): Paul Stuever, Kieran Delaney
// Created on: 01/19/2024           
//
// Revised on: 01/22/2023
// Revision: Paul added nowplaying and getqueue.
// Revised on: 01/29/2023
// Revision: Paul added addtoqueue
// Revised on: 02/04/2023
// Revision: Kieran added skipSong
//
// Preconditions: Must have npm and node installed to run in dev environment. Must have a php server running for it to work.
// Postconditions: Route to the appropriate php calls for our frontend.
// 
// Error conditions: None
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

function throwError(error) {
    console.log(error);
}

const authorizationApi = () => {

    const [phpResponse, setResponse] = useState(null);

    // const { roomCode } = useSelector(state => state.roomCode);
    const roomCode = 'ABCD';

    const addToQueue = (songString) => {
        let xhr = makeRequest('addToQueue');
        xhr.send('roomCode=' + roomCode + '&query=' + songString);
    }

    const getQueue = () => {
        let xhr = makeRequest('getQueue');
        xhr.send('roomCode=' + roomCode);
    }

    const nowPlaying = () => {
        console.log("now playing");
        let xhr = makeRequest('nowPlaying');
        xhr.send('roomCode=' + roomCode);
    }

    const skipSong = () => {
        let xhr = makeRequest('skipSong');
        xhr.send('roomCode=' + roomCode);
    }

    const makeRequest = (phpUrl) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `http://localhost:8000/Server/Spotify/${phpUrl}.php`, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = () => {
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

        }
        return xhr;
    }
    return { makeRequest, addToQueue, nowPlaying, skipSong, phpResponse };
};

export default authorizationApi;