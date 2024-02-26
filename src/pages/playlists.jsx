//--------------------------------
// File: spotifyPlaylists.jsx
// Description: This react component fetches user's Spotify playlists using spotify-web-api-js library and renders them in a dropdown element.
// Programmer(s): Chinh Nguyen, Nicholas Nguyen
// Created on: 01/31/2024
//
// Revised on: 02/09/2024
// Revision: Nicholas added PaletteContext to the component and made the button have a dynamic background color
// Revised on: 2/10/2024
// Revision: Chinh fixed API calls to correctly call function from authorizationApi.jsx to fetch playlists
// Revised on: 2/17/2024
// Revision: Chinh sanitized response from getPlaylists.php and mapped the playlists to a dropdown element
// Revised on: 2/24/2024
// Revision: Chinh started to add functionality to add tracks from fallback playlist to queue
// Preconditions: npm and node must be installed for dev environment, spotify-web-api-js library must be installed
// Postconditions: Currently attempts to console.log list of user's playlists,
//                 Goal is to render an autocomplete element containing user's Spotify playlists
// Error conditions: None
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------

import { useState } from 'react' 
import authorizationApi from '../authorizationApi';

function SpotifyPlaylists() {
    const [isLoading, setIsLoading] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const { getPlaylists } = authorizationApi();
    const { getTracks } = authorizationApi();
    const { nowPlaying } = authorizationApi();

    var fallbackTracks = [];

    const fetchPlaylists = async () => {
        setIsLoading(true);
        //getPlaylists();
        try {
            const response = await getPlaylists();
            setPlaylists(response);
        } catch (error) {
            console.error('Could not fetch playlists:', error);
        };
        setIsLoading(false);
    };

    const fetchTracks = async () => {
        let playlistID = document.getElementById("selectPlaylist").value;
        if (playlistID === "") {
            alert("Please fetch playlists first and make sure a playlist is selected.")
            return;
        }

        try {
            const response = await getTracks(playlistID);
            console.log("Tracks of selected playlist:", response);
            // Add tracks from response to local fallbackTracks variable
            for (let i = 0; i < response.length; i++) {
                fallbackTracks.push(response[i].id);
            }
            console.log(fallbackTracks);
        } catch (error) {
            console.log('Could not fetch tracks:', error);
        };
    }

    // TODO: I need nowPlaying response to be stored in a variable
    // I can sanitize it myself later.

    // const addToQueueFromFallback = () => {
    //     let timer = nowPlaying();
    //     console.log(timer);
    // }

    // Run addToQueueFromFallback every 10 seconds
    //setInterval(addToQueueFromFallback, 10000);

    return (
        <div>
            <button id="fetchPlaylistsBtn" className="queueButton" onClick={fetchPlaylists} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Fetch and Load Playlists'}
            </button>

            <select id="selectPlaylist">
                {Array.isArray(playlists) && playlists.map((playlist, index) => {
                    // console.log("Mapping playlist:", playlist); // Log each playlist being mapped
                    return (
                        <option key={index} value={playlist.id}>
                            {playlist.name}
                        </option>
                    );
                })}
            </select>

            <button id="fetchTracksBtn" className="queueButton" onClick={fetchTracks} disabled={isLoading}>
                Get Tracks of Selected Playlist
            </button>

        </div>
    );
}

export default SpotifyPlaylists;