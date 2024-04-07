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
// Revised on: 10/22/2023
// Revision: Kieran added the add to queue functionality by adding a useHostAPI function for the different style of authentication that's required to be able to do those calls which affect a spotify premium user
// Revised on: 10/25/2023
// Revision: Kieran added the logout function to the UseHostAPI which clears the saved token states from the app
// Revised on: 11/08/2023
// Revision: Kieran added code for making the spotify API call to get the user's currently playing song object
// Preconditions: Must have client ID and client secret in client.json. These credentials are found in the Spotify Development dashboard https://developer.spotify.com/dashboard within the app settings.
// Postconditions: Returns json data from Spotify to the react app to be parsed and then rendered as needed to the site.
// Error conditions: If token is null or http status is anything other than the good 200 (401, 400, etc), the Spotify authentication token will be refreshed
// Side effects: No known side effects
// Invariants: Client ID and client secret should remain the same throughout the many render cycles 
// Faults: None
//--------------------------------
import React from 'react'; // import react dependencies for usestates and exporting modules
import env from '../client.json' // importing the spotify dev app client ID and secret from our local json file 
const CLIENT_ID = env.CLIENT_ID; //client id alias
const CLIENT_SECRET = env.CLIENT_SECRET;//client secret alias
const REDIRECT_URI = "http://localhost:3000/callback"; //variable for the callback url. this is used for returning to the app after logging into spotify
const SCOPES = ["playlist-read-private", "app-remote-control", "user-modify-playback-state"].join(" "); //scopes of what access the user logging into spotify is granting us 

export const getAuthUrl = () => { //function to redirect to the spotify login page 
    const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`; //link containing scopes for what the user will grant us access to 
    return AUTH_URL; //return the link back to the app to be set to the url bar and sent to
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
        // console.log( data.accessToken + " fart" );
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

    const makeRequest = async (urlOptions) => { // makerequest function which is the "main" of this api calling system. It takes in an append portion for the base url specified in the useAPI() call, and this append portion urloptions allows for different search requests or other data requests under the same base request type
        if(CLIENT_ID=="add_client_id_locally___Dont_push_to_github_for_security_concerns" || CLIENT_SECRET=="add_client_secret_locally___Dont_push_to_github_for_security_concerns"){
            console.warn("EASY FIX: Don't forget to add the Client ID and Client Secret locally to client.json for this to work!");// added this for testing purposes
            if(!alert("ERROR: Add Client ID and secret to your local client.json file, or the API calls won't work."))
                window.location.reload(); //if the client.json file still contains the GitHub placeholder text, show error and then refresh page after user clicks OK
        }
        
        // get token if it hasn't been made yet
        // console.log( accessToken );
        let token = accessToken; //sets to local variable so it updates in this render cycle
        if(token == null){ // check if token is the initial null state
            token = await refreshToken(); // if so, set it to a new token
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

export const useHostAPI = url => { // this is needed for api calls that work with user spotify data, as the authentication process is different than for the useapi calls and requires different priveledges 
    const [hostAccessToken, setAccessToken] = React.useState(null); //storing token here
    const [refreshTokenParam, setRefreshToken] = React.useState(null); //storing refresh token here
    const logout = () =>{ //logout function that clears the tokens stored in the states
        setAccessToken(null); //reverts the access token save back to null
        setRefreshToken(null); //reverts the refreshtoken parameter save back to null
    }

    const createToken = async (code) =>  { // asyncronous function to refresh the spotify authentication function
        if(code=="empty") return; //handle edge case 

        // await refreshToken();
        let body = new URLSearchParams({ //sets the body elements of the call
            grant_type: 'authorization_code', //we are getting the auth code for the access token
            code: code, //code that we got through the url bar when the user logged in is passed in here
            redirect_uri: REDIRECT_URI, // pass in the redirect uri 
            client_id: CLIENT_ID, //pass in the client id 
            client_secret: CLIENT_SECRET //the client ID and secret need to be passed in here for it to work, rather than being passed through the html headers
        });
                    
        const param = { // parameters to the spotify authentication token request call
            method: 'POST', // http method is post. get might not work for tokens because they may be too large to fit through the request header, and the token could be compromised throught he URL history
            headers: { // specific header formatting of the HTTP request
              'Content-Type': 'application/x-www-form-urlencoded' // request represents an encoded url
            },
            body: body // body of the request contains the client ID and secret credentials for authentication
        }
        const result = await fetch('https://accounts.spotify.com/api/token', param); // asyncronously fetches the response from the spotify token call request passing in the base token url and our parameters
        const data = await result.json(); // converts the response stream to a json structure of the body, and sets the data variable to this

        // INVALID GRANT: AUTHORIZATION CODE EXPIREED. 
        // console.log( data );
        // if( data.error ) console.log( data.error + ": " + data.error_description );
        // console.log( "code: " + code );

        setAccessToken(data.access_token); //saves the new token to our state to be reused if the request is made again within the token lifetime
        // console.log( "access token: " + data.access_token );
        setRefreshToken(data.refresh_token); //sets the refresh token parameter which is used later for the refresh token requests
        // console.log( "refresh token: " + data.refresh_token );
        return data.access_token; //token is returned so we can use this new token in this render cycle of the react app. otherwise it won't be reflected until the next render cycle (when the token save state is updated) which will be after the refresh function runs
    };

    const refreshToken = async () => { // asyncronous function to refresh the spotify authentication function
        let body = new URLSearchParams({
            grant_type: 'refresh_token', //the grant type is refresh token since that's what we're requesting 
            refresh_token: refreshTokenParam, // we pass in the refresh token that we got from the initial token call
            client_id: CLIENT_ID,//pass in the client id 
            client_secret: CLIENT_SECRET //the client ID and secret need to be passed in here for it to work, rather than being passed through the html headers
        });
        const param = { // parameters to the spotify authentication token request call
            method: 'POST', // http method is post. get might not work for tokens because they may be too large to fit through the request header, and the token could be compromised throught he URL history
            headers: { // specific header formatting of the HTTP request
                'Content-Type': 'application/x-www-form-urlencoded' // request represents an encoded url
              },
            body: body // body of the request contains the client ID and secret credentials for authentication
        }
        const result = await fetch('https://accounts.spotify.com/api/token', param); // asyncronously fetches the response from the spotify token call request passing in the base token url and our parameters
        const data = await result.json(); // converts the response stream to a json structure of the body, and sets the data variable to this
        // console.log( "useHostAPI " + data );
        setAccessToken(data.access_token); //saves the new token to our state to be reused if the request is made again within the token lifetime
        return data.access_token; //token is returned so we can use this new token in this render cycle of the react app. otherwise it won't be reflected until the next render cycle (when the token save state is updated) which will be after the refresh function runs
    };

    const queueAddRequest = async (url, hostAccessToken) => { //function to add song to user's Spotify queue
        const param = { // parameters of the http request
            method: 'POST', // using the GET method because this will be repeated many times and it is well suited for this use
            headers: { // specific header formatting of the HTTP request
              'Authorization': `Bearer ${hostAccessToken}` // the bearer name specifies that authentication is accessible to anyone with the token
            }
          };
          return await fetch(url,param); // returns the response of the spotify data we're requesting by passing in the request url and our request parameters
    };

    const nowPlaying = async (url, hostAccessToken) => { //now playing API call
        const param = {
            method: 'GET', //gets information
            headers: {
                'Content-Type': 'applications/json', //in json object format
                'Authorization': `Bearer ${hostAccessToken}` //needs to use hostaccesstoken since this is info from user's spotify account
            }
        };
        return await fetch(url,param); //gets the object from the url
    }

    const makeRequest = async (urlOptions, code) => { // makerequest function which is the "main" of this api calling system. It takes in an append portion for the base url specified in the useAPI() call, and this append portion urloptions allows for different search requests or other data requests under the same base request type
        if(CLIENT_ID=="add_client_id_locally___Dont_push_to_github_for_security_concerns" || CLIENT_SECRET=="add_client_secret_locally___Dont_push_to_github_for_security_concerns"){
            console.warn("EASY FIX: Don't forget to add the Client ID and Client Secret locally to client.json for this to work!");// added this for testing purposes
            if(!alert("ERROR: Add Client ID and secret to your local client.json file, or the API calls won't work."))
                window.location.reload(); //if the client.json file still contains the GitHub placeholder text, show error and then refresh page after user clicks OK
        }
        
        // get token if it hasn't been made yet
        let token = hostAccessToken; //sets to local variable so it updates in this render cycle
        // console.log( token );

        if(token == null){ // check if token is the initial null state
            token = await createToken(code); // if so, set it to a new token
            // console.log( "makeRequest createToken(code) " + token );
        }

        if(urlOptions=='/currently-playing'){ //now playing call
            let result = await nowPlaying(url+urlOptions,token); //tries to make call for now playing song object
            if (result.status != 200){ //if status isn't a success, this likely is due to the token being expired, so it will refresh the token
                token = await refreshToken(); // overwrites the existing token with a new token
                result = await nowPlaying(url+urlOptions,token); // makes the call again with the now valid token
            }
            const data = await result.json(); //gets the json object from the response
            return data; //returns it
        }


        let result = await queueAddRequest(url+urlOptions,token);
        if (result.error ){ //if status isn't a success, this likely is due to the token being expired, so it will refresh the token
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
    //    console.log( token );
    //    console.log( result );
        if (result.status != 204)
            alert("ERROR: No active device found. Please ensure that you're logged into spotify and currently have something playing. Then add to queue should work. Result.status: " + result.status + ".");
                // window.location.reload();

        return result.status;
    };

    return { makeRequest, logout }; // returns the makerequest object which contains the api response data, and returns the logout function so it can be called in App.jsx
};