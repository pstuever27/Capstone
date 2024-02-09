//--------------------------------
// File: spotifyPlaylists.jsx
// Description: This react component fetches user's Spotify playlists using spotify-web-api-js library and renders them in a dropdown element.
// Programmer(s): Chinh Nguyen
// Created on: 01/31/2024
// Preconditions: npm and node must be installed for dev environment, spotify-web-api-js library must be installed
// Postconditions: Currently attempts to console.log list of user's playlists,
//                 Goal is to render an autocomplete element containing user's Spotify playlists
// Error conditions: None
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------

// useAPI, getAuthURl, and useHostAPI are necessary functions from SpotifyAPI.js
import { useAPI, getAuthUrl, useHostAPI } from '../SpotifyAPI';
import { useState, useEffect } from 'react'
// imports textfield component of material UI for input field of search bar
import TextField from '@mui/material/TextField'; 
import Autocomplete from '@mui/material/Autocomplete';
// allows usage of contexts
import { useContext } from 'react';
import authorizationApi from '../authorizationApi';

const SpotifyPlaylists = () => {
    const [isLoading, setIsLoading] = useState(false);

    const fetchPlaylists = () => {
        setIsLoading(true);
        fetch('http://localhost:8000/Server/Spotify/getPlaylists.php')

            .then(response => response.json())
            .then(data => {
                console.log(data); // Logging the playlists to the console
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching playlists:', error);
                setIsLoading(false);
            });
    };

    return (
        <div>
            <button onClick={fetchPlaylists} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Get Playlists'}
            </button>
        </div>
    );
}

export default SpotifyPlaylists;
