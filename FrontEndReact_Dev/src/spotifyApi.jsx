import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

function throwError(error) {
    console.log(error);
}

const clientAPI = () => {

    const [phpResponse, setResponse] = useState(null);

    const { clientAccessToken } = useSelector(state => state.clientAccessToken);

    const [phpUrl, setUrl] = useState(null);

    const clientAccess = () => {
        setUrl('clientCreds');
        let xhr = makeRequest();
        xhr.send();
    }

    const search = (query) => {

        setUrl('search');
        if (!clientAccessToken /* || token expired*/) {
            clientAccess();
        }
        let xhr = makeRequest();
        xhr.send('query=' + query + '&token' + clientAccessToken);

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
    return { makeRequest, clientAccess, search, phpResponse };
};

export default clientAPI;