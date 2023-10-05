import React from 'react';
import env from '../client_secret.json'

const CLIENT_ID = "585ff571a79142129e95d7f13861c2ea";

export const useAPI = url => {
    const [accessToken, setAccessToken] = React.useState(null); //storing token here

    const refreshToken = async () => {
        const param = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${env.CLIENT_SECRET}`
        }
        const result = await fetch('https://accounts.spotify.com/api/token', param);
        const data = await result.json();
        setAccessToken(data.access_token); //used if the request is made again
        return data.access_token; //needs to be returned so we can use the new token in this render cycle of the react app. otherwise it won't be reflected until the next render cycle which will be after the refresh function runs
    };

    const spotifyFetch = async (url, accessToken) => {
        const param = {
            method: 'GET',
            headers: {
              'Content-Type': 'applications/json',
              'Authorization': `Bearer ${accessToken}`
            }
          };
          return await fetch(url,param);
    };

    const makeRequest = async (urlOptions) => {
        // get token if it hasn't been made yet
        let token = accessToken; //sets to local variable so it updates in this render cycle
        if(token == null){
            token = await refreshToken();
        }
        //make the request
        let result = await spotifyFetch(url+urlOptions,token);
        if (result.status != 200){ //if status isn't good, it will refresh
            token = await refreshToken();
            result = await spotifyFetch(url+urlOptions,token);
        }
        const data = await result.json();
        return data;
    };

    return { makeRequest };
};