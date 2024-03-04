//--------------------------------
// File: Main.jsx
// Description: This is the react component that does the explicit rendering of the site
// Programmer(s): Rylan DeGarmo
// Created on: 2/26/2024
// Preconditions: npm and node must be installed for dev environment, spotify-web-api-js library must be installed
// Postconditions: Renders ban list for queue call prevention.
// Error conditions: None
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------

// useAPI, getAuthURl, and useHostAPI are necessary functions from SpotifyAPI.js
import { useAPI, useHostAPI } from '../SpotifyAPI'; 

// useState is used to perform side effects in function components. 
import { useState } from 'react' 

// allows usage of contexts
import { useContext } from 'react';

// utocomplete renders the search results of the search bar. 
import { useAutocomplete } from '@mui/base/useAutocomplete';

// imports queue context to manipulate queue data structure across components
import QueueContext from './queueContext';

// imports palette context to manipulate color palette across components
import PaletteContext from './paletteContext';

// imports authorizationApi for adding songs to the Banned queue
import authorizationApi from '../authorizationApi';

import { useLocation } from 'react-router-dom'

function BanList() {
    // INITIALIZING STATE VARIABLES
  
    const { enqueue } = useContext( QueueContext );
  
    // This is the default inputVal (blank) for the search bar. 
    const [inputVal, setInputValue] = useState( "" ); 
  
    // reqSearch is a function used to search for the value stored at inputVal
    // The syntax `{ makeRequest: reqSearch }` uses JavaScript's destructuring assignment to 
    //  extract the `makeRequest` function from the object returned by `useAPI`. 
    //  It also renames `makeRequest` to `reqSearch` for use in this component.
    const { makeRequest: reqSearch } = useAPI( 'https://api.spotify.com/v1/search' ); 
  
    const { makeRequest: reqPlayer } = useHostAPI( 'https://api.spotify.com/v1/me/player' ); 
  
    const { addToQueue: addQueue } = authorizationApi();
  
    // An empty list state is used to store search results.
    // These search results will be rendered in the search bar dropdown. 
    const [searchResults, setSearchRes] = useState( [] ); 
  
    // A null-initialized save state is used to have its value set as
    //  the user-selected song from the search results. 
    const [songChoice, setSongChoice] = useState( null ); 
  
    // An empty list state is used to store the blocked songs.
    const [blockedSongs, setBlockedSong] = useState( [] ); 
  
    const { palette } = useContext(PaletteContext);
    
    const location = useLocation();
  
    const { getInputProps, getListboxProps, getOptionProps,  groupedOptions } = useAutocomplete( {
      /***************************************************************************/
      /* The following properties are used to configure the search bar dropdown. */
      /***************************************************************************/
      id: 'search-box',
      value: songChoice,
      inputValue: inputVal,
      options: searchResults,
      noOptionsText: 'Oops! Nothing :(',
      autoHighlight: true,
      disablePortal: true,
  
      onInputChange: (event, newInputValue) => {
        setInputValue(newInputValue);
        if (newInputValue !== "") {
          search(); // Trigger search based on new input
        }
      },
  
      onChange: (event, newValue) => {
        setSongChoice(newValue);
      },
  
      isOptionEqualToValue: (option, value) => `${option.name} - ${option.artists[0].name}` === `${value.name} - ${value.artists[0].name}`,
      getOptionLabel: (searchResult) => `${searchResult.name} - ${searchResult.artists.map((_artist) => _artist.name).join(", ")}`,
    });

    async function addToBanned() {
        // Verifies that the user has selected a song from the search results & it isn't blocked
        if( songChoice != null && !blockedSongs.includes( songChoice ) ){
          // Adds songChoice to the visual queue on screen
          
          enqueue( songChoice ); 
    
          // If the user has logged into spotify and the callback result is in the url bar
          if ( location.hash === '#/callback' || location.pathname === '/join') { 
            // Parse the elements of the url, retain only the search query after `?` in the URL
            let urlParams = new URLSearchParams( window.location.search ); 
    
            // Get the code from the url; if the url doesn't contain a code, set code variable to "empty"
            let code = urlParams.get( 'code' ) || "empty";
    
            // calls the add to queue API request
            // `.then( () => {} )` literally does nothing. `then()` is required syntax. 
            addQueue( songChoice.id );    
          }
    
          // if the url doesn't contain callback, it means they didn't login to spotify first 
          else {
            // throw an alert, error dialog window
            alert( "Must login to manipulate the Spotify queue." ); 
          }
        }

        // reinitializes the song choice to be empty
        setSongChoice( null ); 
    }

    <div>
            
            <button id="SongBan" className="banButton" onClick={() => addToBanned()} disabled={isLoading}>
                Add to Ban List
            </button>

            <button id="banShow" className="banButton" onClick={showBanned} disabled={isLoading}>
                Show Banned Songs
            </button>

    </div>
}

export default BanList