//--------------------------------
// File: search.jsx (derived from App.jsx)
// Description: This react component provides search logic. 
// Programmer(s): Nicholas Nguyen
// Created on: 01/19/2024
//
// Preconditions: Must have npm and node installed to run in dev environment. 
//                Also see SpotifyAPI.js for its preconditions.
// Postconditions: Renders searchbar which allows searching songs from spotify and 
//                  adding / blocking them from a queue data structure on screen.
// 
// Error conditions: 
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------

// useAPI, getAuthURl, and useHostAPI are necessary functions from SpotifyAPI.js
import { useAPI, getAuthUrl, useHostAPI } from '../SpotifyAPI'; 

// useState is used to perform side effects in function components. 
// Side effects interact outside of the component. 
// 
// The `useEffect` hook takes two arguments: 
//  a function that contains the side-effect logic, 
//  and an array of dependencies. 
// The function runs after every render, including the first one. 
// However, if you provide an array of dependencies, 
// the function will only run when the dependencies have changed.
import { useState } from 'react' 

// imports textfield component of material UI for input field of search bar
import TextField from '@mui/material/TextField'; 

// Autocomplete renders the search results of the search bar. 
import Autocomplete from '@mui/material/Autocomplete';

// imports queue context to manipulate queue data structure across components
import QueueContext from './queueContext';

// allows usage of contexts
import { useContext } from 'react';
import authorizationApi from '../authorizationApi';

import authorizationApi from '../authorizationApi';

function Search() {
  // INITIALIZING STATE VARIABLES

  const { enqueue } = useContext( QueueContext );

  const { addToQueue: addQueue } = authorizationApi();

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

  /**
   * @brief This function is used to add a song to the queue. 
   *        The song added is whatever is stored in songChoice.
   *        This is called by `onClick` events from `<button>` tags. 
   * 
   * @precondition songChoice must not be null
   * @params none
   */
  async function addToQueue() {
    // Verifies that the user has selected a song from the search results & it isn't blocked
    if( songChoice != null && !blockedSongs.includes( songChoice ) ){
      // Adds songChoice to the visual queue on screen
      
      enqueue( songChoice.artists[0].name + " - " + songChoice.name ); 
      console.log( songChoice.artists[0].name + " - " + songChoice.name );

      // If the user has logged into spotify and the callback result is in the url bar
      if ( window.location.pathname === '/callback' ) { 
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

  /**
   * @brief This function is used to search for songs from Spotify.
   *        It is called by `onInputChange` events from `<Autocomplete>` tags.
   * 
   * @precondition inputVal must not be empty
   */
  async function search() { 
    // if the search bar is empty, don't try to do api calls and simply return to skip
    if( inputVal.length == 0 ) { 
      return; 
    } 
    
    // calling the search api call, appending the search query with with search bar field input
    //  as the track name being requested after the asyncronous promise of the api call is fulfilled, 
    //  we'll perform the callback function below take the json 'data' variable from the SpotifyAPI.js
    //  makeRequest return statement as the parameter of the function
    reqSearch( `?q=${ inputVal }&type=track` ).then( data => { 
      if( !data.tracks ){ // handle invalid searches
        // if no spotify tracks correspond to the search bar input text, return to skip.
        // otherwise we'll try to access track and artist name data that isn't available and get errors.
        return; 
      }

      // print spotify request json data to the browser's console. 
      // useful for navigating through the json structure with the gui dropdowns as a reference on how 
      //  to access certain data you need within it
      console.log( data ); 

      // adds each spotify track data object into our array
      setSearchRes( data.tracks.items.map( item => item ) );
    } );
  }

  /**
   * @brief This function is used to replay the song that is currently playing on Spotify.
   * 
   * @precondition There is a currently playing song in the host's queue.
   *               The user must be logged into Spotify.
   * @params none
   */
  async function replaySong() {
    // If the user has logged into spotify and the callback result is in the url bar
    if (window.location.pathname === '/callback') {
      // Parse the elements of the url, retain only the search query after `?` in the URL
      let urlParams = new URLSearchParams(window.location.search);

      // Get the code from the url; if the url doesn't contain a code, set code variable to "empty"
      let code = urlParams.get('code') || "empty"; 
      
      // Calls the currently-playing API request
      reqPlayer(`/currently-playing`, code).then( ( data ) => {
        // Checks whether data and data.item exist are are truthy.
        if( data && data.item ) { 
          // Save the value returned by data.item to currentSong
          const currentSong = data.item;

          // Re-adds the song to the queue on screen.
          enqueue( currentSong ); 
          
          // Adds the current song to the queue on screen, literally does nothing afterward 
          // Why is this syntax necessary? This is stupid.
          reqPlayer( `/queue?uri = ${ encodeURIComponent( currentSong.uri ) }`, code ).then( () => {} ) 
        } 
        
        // If there is no currently playing song, show an alert
        else {
          // throw an alert, error dialog window
          alert( "No song is currently playing on Spotify." ); 
        }
      } );
    }
    
    // If the url doesn't contain callback, it means they didn't login to spotify first
    else {
      // throw an alert, error dialog window
      alert( "Must login to manipulate the Spotify queue." ); 
    }
  }

  /**
   * @brief This function is used to block a song from being added to the queue.
   */
  async function blockFromQueue(){
    if(songChoice != null){
      setBlockedSong([...blockedSongs, songChoice]); // Add the selected song to the blockedSongs list
    }
  }

  return ( 
    <>
      {/* div for search bar, using the searchDiv styling */}
      <div className="searchDiv"> 
        {/* renders search bar title with text shadow */}
        {/* <h1 id = "search_header">Search</h1>  */}

        {/* autocomplete MUI component for rendering the search results under the search bar as the user types */}
        <Autocomplete  
          // allows for customizing the style of the popper component, 
          // which isn't possible for portal-based autocomplete components
          disablePortal  

          // automatically does a focused highlight on the first search result, 
          // so the user can quickly type and hit the enter key on that top result, 
          // or use the arrow keys to select a different one from the list
          autoHighlight 

          // This makes it so that when there are no search options for the inputted text, 
          //  it will just be a blank empty space below ' ' or it will say 'Oops! Nothing :(' 
          //  depending on what's in this parameter, rather than showing the "No options" default. 
          // This looks more streamlined.
          noOptionsText = {'Oops! Nothing :('} 

          //sets the html id of this autocomplete tag to be search-box
          id = "search-box" 

          // sets the song that the user selected from the search results list to the songChoice save state
          value = {songChoice} 

          // saves the text inputted to the search bar by the user to the inputVal save state
          inputValue = {inputVal} 

          // when the user is typing in the search bar, the new text is passed in through the 
          //  newInputValue argument. the event arguement can be used later if needed, 
          //  but is required to be listed for the function to work.
          onInputChange = { ( event, newInputValue ) => { 
              // saves the new text typed in the search bar to the inputvalue state
              setInputValue(newInputValue); 

              // runs the search function to get the spotify search results based off the text the user inputted
              if(newInputValue!="") {
                search(); 
              }
            }
          } 

          // when the user selects a different search result, the new selected value is passed into this function
          onChange = { ( event, newValue ) => { 
            // the new song is saved in the songChoice state
            setSongChoice( newValue ); 
          } }
          
          //used to eliminate a warning
          isOptionEqualToValue = { ( option, value ) => `${ option.name } - ${ option.artists[0].name }`===`${ value.name } - ${ value.artists[0].name }`} 

          //renders the song option text in the dropdown in the format "Track - Artist"
          getOptionLabel = { searchResult => `${ searchResult.name } - ${ searchResult.artists[0].name }`} 

          // the "options" prop takes an array of what will be shown as the listed options 
          //  that the user can search through. 
          // These are set to the searchResults array filled with spotify search results 
          //  from the search() function
          options = { searchResults} 

          // sets the width of the search box to be 300 px, font family to proxima-nova
          // sx = { { 
          //   width: 'max-width', fontFamily: 'proxima-nova',
          //   height: '40px',
          //   margin: '20px',
          //   marginBottom: '10px',
          //   borderRadius: '50px',
          // } } 

          // this ties it all together, rendering the textfield and search results based off the inputted params. 
          // the label "Search Songs" is the ghost placeholder text that renders in the text field when empty.
          renderInput = { ( params ) => ( 
            <TextField { ...params } 
              // placeholder text
              label = "Search Songs" 
              // mui style override
              // sx = { { 
              //   width: 'max-width', fontFamily: 'proxima-nova',
              //   height: '40px',
              //   margin: '20px',
              //   marginBottom: '10px',
              //   borderRadius: '50px',
              // } } 
              /> 
          ) } 
        />

        <input 
          autoComplete = "on" 
          type = "text" 
          list = { searchResults } 
          placeholder = {'Oops! Nothing :('} />
        
        { /* this is the button stack below search bar */ }
        <div id = "queueButtonStack"> 
          {/* clicking button calls the function to add song to queue */}
          <button className = "queueButton" onClick = { () => addToQueue() }>Add to Queue</button>

          {/* clicking button calls the function to add song to queue */}
          <button className = "queueButton" onClick = { () => replaySong() }>Replay</button>

          {/* clicking button calls the function to block the song from queue */}
          <button className = "queueButton" onClick = { () => blockFromQueue() }>Block</button>
        </div>
      </div>
    </>
  );
}

export default Search