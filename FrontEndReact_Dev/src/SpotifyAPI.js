//--------------------------------
// File: SpotifyAPI.js
// Description: React component for handling Spotify API calls
// Programmer(s): Kieran Delaney, Chinh Nguyen
// Created on: 10/05/2023
// Revised on: 10/06/2023
// Revision: Kieran moved client ID to be defined in client.json file and made changes to the API authentication call to handle this change.
// Revised on: 10/21/2023
// Revision: Kieran added a popup warning and console warning log for if the client.json file doesn't have our developer app credentials added
// Revised on: 10/21/2023
// Revision: Chinh added the getAuthUrl() function to get the authentication url for the spotify login and added variables for client id/secret, redirect uri, and scopes
// Preconditions: Must have client ID and client secret in client.json. These credentials are found in the Spotify Development dashboard https://developer.spotify.com/dashboard within the app settings.
// Postconditions: Returns json data from Spotify to the react app to be parsed and then rendered as needed to the site.
// Error conditions: If token is null or http status is anything other than the good 200 (401, 400, etc), the Spotify authentication token will be refreshed
// Side effects: No known side effects
// Invariants: Client ID and client secret should remain the same throughout the many render cycles 
// Faults: None
//--------------------------------
import React from 'react'; // import react dependencies for usestates and exporting modules
import env from '../client.json' // importing the spotify dev app client ID and secret from our local json file 
const CLIENT_ID = env.CLIENT_ID;
const CLIENT_SECRET = env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/callback";
const SCOPES = ["playlist-read-private", "app-remote-control", "user-modify-playback-state"].join(" ");

export const getAuthUrl = () => {
    const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    return AUTH_URL;
  };

export const useAPI = url => { // exports these functions to the other module that imports this file, and takes a base url as a parameter
    const [accessToken, setAccessToken] = React.useState(null); //storing token here

    const refreshToken = async () => { // asyncronous function to refresh the spotify authentication function
        const param = { // parameters to the spotify authentication token request call
            method: 'POST', // http method is post. get might not work for tokens because they may be too large to fit through the request header, and the token could be compromised throught he URL history
            headers: { // specific header formatting of the HTTP request
              'Content-Type': 'application/x-www-form-urlencoded' // request represents an encoded url
            },
            body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}` // body of the request contains the client ID and secret credentials for authentication
        }
        const result = await fetch('https://accounts.spotify.com/api/token', param); // asyncronously fetches the response from the spotify token call request passing in the base token url and our parameters
        const data = await result.json(); // converts the response stream to a json structure of the body, and sets the data variable to this
        setAccessToken(data.access_token); //saves the new token to our state to be reused if the request is made again within the token lifetime
        return data.access_token; //token is returned so we can use this new token in this render cycle of the react app. otherwise it won't be reflected until the next render cycle (when the token save state is updated) which will be after the refresh function runs
    };

    const spotifyFetch = async (url, accessToken) => { // spotify fetch function to get spotify data, passing in the url to specify the type of data being requested, and the authentication token
        const param = { // parameters of the http request
            method: 'GET', // using the GET method because this will be repeated many times and it is well suited for this use
            headers: { // specific header formatting of the HTTP request
              'Content-Type': 'applications/json', // specifies that we want the response to be in json format
              'Authorization': `Bearer ${accessToken}` // the bearer name specifies that authentication is accessible to anyone with the token
            }
          };
          return await fetch(url,param); // returns the response of the spotify data we're requesting by passing in the request url and our request parameters
    };

    const queueAddRequest = async (url, accessToken) => {
        const param = { // parameters of the http request
            method: 'POST', // using the GET method because this will be repeated many times and it is well suited for this use
            headers: { // specific header formatting of the HTTP request
              'Authorization': `Bearer ${accessToken}` // the bearer name specifies that authentication is accessible to anyone with the token
            }
          };
          return await fetch(url,param); // returns the response of the spotify data we're requesting by passing in the request url and our request parameters
    };

    const makeRequest = async (urlOptions) => { // makerequest function which is the "main" of this api calling system. It takes in an append portion for the base url specified in the useAPI() call, and this append portion urloptions allows for different search requests or other data requests under the same base request type
        if(CLIENT_ID=="add_client_id_locally___Dont_push_to_github_for_security_concerns" || CLIENT_SECRET=="add_client_secret_locally___Dont_push_to_github_for_security_concerns"){
            console.warn("EASY FIX: Don't forget to add the Client ID and Client Secret locally to client.json for this to work!");// added this for testing purposes
            if(!alert("ERROR: Add Client ID and secret to your local client.json file, or the API calls won't work."))
                window.location.reload(); //if the client.json file still contains the GitHub placeholder text, show error and then refresh page after user clicks OK
        }
        
        // get token if it hasn't been made yet
        let token = accessToken; //sets to local variable so it updates in this render cycle
        if(token == null){ // check if token is the initial null state
            token = await refreshToken(); // if so, set it to a new token
        }


        if(url=='https://api.spotify.com/v1/me/player/queue?uri='){
            let result = await queueAddRequest(url+urlOptions,token);
            if (result.status != 204){ //if status isn't a success, this likely is due to the token being expired, so it will refresh the token
                token = await refreshToken(); // overwrites the existing token with a new token
                result = await queueAddRequest(url+urlOptions,token); // makes the call again with the now valid token
            }
            /*
                RESPONSE SAMPLE from https://developer.spotify.com/documentation/web-api/reference/add-to-queue
                {
                "error": {
                    "status": 404,
                    "message": "Player command failed: No active device found",
                    "reason": "NO_ACTIVE_DEVICE"
            */
            if (result.status != 204)
                if(!alert("ERROR: No active device found. Please ensure that you're logged into spotify and currently have something playing. Then add to queue should work."))
                    window.location.reload();
            return result.status;
        }

        //make the request
        let result = await spotifyFetch(url+urlOptions,token); // pass the full url of its base url and specified call details, along with the current token, and set the response to a result variable
        if (result.status != 200){ //if status isn't a success, this likely is due to the token being expired, so it will refresh the token
            token = await refreshToken(); // overwrites the existing token with a new token
            result = await spotifyFetch(url+urlOptions,token); // makes the call again with the now valid token
        }
        const data = await result.json(); // converts the response to the reponse body's json data, and binds it to a variable
        return data; //returns this data of the api call request which contains the information we want
    };

    return { makeRequest }; // returns the makerequest object which contains the api response data
};