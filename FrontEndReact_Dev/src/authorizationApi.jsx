import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

function throwError(error) {
    console.log(error);
}

const authorizationApi = () => {

    const [phpResponse, setResponse] = useState(null);

    const { roomCode } = useSelector(state => state.roomCode);

    const [phpUrl, setUrl] = useState('authCreds');

    const authAccess = () => {
        setUrl('authCreds');
        let xhr = makeRequest();
        xhr.send();
    }

    const getQueue = () => {
        setUrl('getQueue');
        let xhr = makeRequest();
        xhr.send('roomCode=' + roomCode);
    }

    const nowPlaying = () => {
        setUrl('nowPlaying');
        console.log("now playing");
        let xhr = makeRequest();
        xhr.send('roomCode=ABCD');
    }

    const makeRequest = () => {
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
    return { makeRequest, authAccess, nowPlaying, phpResponse };
};

export default authorizationApi;