//--------------------------------
// File: search.jsx (derived from App.jsx)
// Description: This react component provides search logic. 
// Programmer(s): Nicholas Nguyen
// Created on: 01/19/2024
// 
// Revised on: 02/09/2024
// Revision: Nicholas recreated the MUI search bar using the MUI base, headless autocomplete component
//           also added color palette context to change the color of buttons
// Revised on: 03/02/2024
// Revision: Chinh adjusted addToQueue to not be the function responsible to add to Spotify queue
// Revised on: 03/09/2024
// Revision: Chinh implemented blocklist functionality utilizing QueueContext
// Revised on: 3/18/2024
// Revision: Chinh added two ways to shuffle queue, one via checkbox where it adds randomly from queue or one that actually shuffles live
// Revised on: 4/05/2024
// Revision: Kieran moved replay button to nowplaying block rather than being here to better match our design goals
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
import { useAPI, useHostAPI } from '../SpotifyAPI'; 

// useState is used to perform side effects in function components. 
import { useEffect, useState } from 'react' 

// utocomplete renders the search results of the search bar. 
import { useAutocomplete } from '@mui/base/useAutocomplete';

// imports queue context to manipulate queue data structure across components
import QueueContext from './queueContext';

// imports palette context to manipulate color palette across components
import PaletteContext from './paletteContext';

// allows usage of contexts
import { useContext } from 'react';

// imports authorizationApi for adding songs to the queue
import authorizationApi from '../authorizationApi';

// imports Playlists component
import Playlists from './playlists';

import { useLocation } from 'react-router-dom'

import phpAPI from '../phpApi';
import Cookies from 'universal-cookie';
import Notification from './notification';
import { useForceUpdate } from '@mantine/hooks';


function Search() {
  // INITIALIZING STATE VARIABLES

  const { enqueue } = useContext( QueueContext );
  const { blocklist, addBlocklist, clearBlocklist } = useContext( QueueContext );

  // This is the default inputVal (blank) for the search bar. 
  const [inputVal, setInputValue] = useState( "" ); 

  // reqSearch is a function used to search for the value stored at inputVal
  // The syntax `{ makeRequest: reqSearch }` uses JavaScript's destructuring assignment to 
  //  extract the `makeRequest` function from the object returned by `useAPI`. 
  //  It also renames `makeRequest` to `reqSearch` for use in this component.
  const { makeRequest: reqSearch } = useAPI( 'https://api.spotify.com/v1/search' ); 

  const { makeRequest: reqPlayer } = useHostAPI( 'https://api.spotify.com/v1/me/player' ); 

  const { makeRequest: blockListRequest, phpResponse } = phpAPI();

  const cookie = new Cookies();

  // An empty list state is used to store search results.
  // These search results will be rendered in the search bar dropdown. 
  const [searchResults, setSearchRes] = useState( [] ); 

  // A null-initialized save state is used to have its value set as
  //  the user-selected song from the search results. 
  const [songChoice, setSongChoice] = useState( null ); 

  const { palette } = useContext(PaletteContext);
  
  const location = useLocation();

  const [openNotif, setOpenNotif] = useState(null);

  const [notifMessage, setNotifMessage] = useState(null);

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

  useEffect( () => {
    if(notifMessage != null){
      setOpenNotif(null);
    }
  }, [notifMessage])

  useForceUpdate((null), [blocklist]);

  /**
   * @brief This function is used to add a song to the queue. 
   *        The song added is whatever is stored in songChoice.
   *        This is called by `onClick` events from `<button>` tags. 
   * 
   * @precondition songChoice must not be null
   * @params none
   */

  useEffect(() => {
    clearBlocklist();
    if (phpResponse) {
      console.log("hereeeee");
      if (!phpResponse.status) {
        phpResponse.map((id, index) => {
          console.log(id.name);
          addBlocklist(id.name);
        })
        console.log(blocklist);
      }
    }
    addToQueue();
  }, [phpResponse])
  
  async function addToQueue() {

    // Checks to see if in blocklist from QueueContext, can do anything based off that
    let blocked = false;

    blocklist.map((song, index) => {
      console.log("Blocked song: ", song);
      console.log("Chosen: ", songChoice.name);
      if (song == songChoice.name) {
        blocked = true
      }
    })
    if (blocked) {
      setNotifMessage(`Song is on the Blocklist: ${songChoice.name}`)
      return;
    }

    // Verifies that the user has selected a song from the search results
    if( songChoice != null ) {

      // If the user has logged into spotify and the callback result is in the url bar
      if ( location.hash === '#/callback' || location.pathname === '/join') { 
        // Parse the elements of the url, retain only the search query after `?` in the URL
        let urlParams = new URLSearchParams( window.location.search ); 

        // Get the code from the url; if the url doesn't contain a code, set code variable to "empty"
        let code = urlParams.get( 'code' ) || "empty";
        // Adds songChoice to the queue context for rendering on screen AND the host's queue
        enqueue( songChoice ); 
        setNotifMessage(`Added ${songChoice.name} to the queue`);
        // calls the add to queue API request
        // `.then( () => {} )` literally does nothing. `then()` is required syntax. 

        // Moved to nowPlaying.jsx! Based off of song duration left.
        // addQueue( songChoice.id );    
      }

      // if the url doesn't contain callback, it means they didn't login to spotify first 
      else {
        // throw an alert, error dialog window
        setNotifMessage( "Must login to manipulate the Spotify queue." ); 
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
   * @brief This function is used to block a song from being added to the queue.
   */
  async function blockFromQueue(){
    if(songChoice != null){
      addBlocklist(songChoice);
      blockListRequest("add-block", cookie.get("roomCode"), songChoice.name, songChoice.uri);
      setSongChoice(null);
      setNotifMessage(`Added ${songChoice.name} to the Blocklist`);
    }
  }

  
  const { songQueue, setQueue } = useContext( QueueContext );

  async function shuffleQueueBtn() {
    const shuffledQueue = [...songQueue].sort(() => Math.random() - 0.5);

    setQueue(shuffledQueue)
  }

  return ( 
    <>
      {/* div for search bar, using the searchDiv styling */}
      <div className="searchDiv"> 
        {/* renders search bar title with text shadow */}
        {/* <h1 id = "search_header">Search</h1>  */}
        
        { /* this is the button stack below search bar */ }
        <div id = "queueButtonStack"> 
          {/*input box*/}
          <input { ...getInputProps() } placeholder="Search Songs" id = "searchBox"/>
          { groupedOptions.length > 0 ? (
            <ul { ...getListboxProps() } id="searchResults">
              { groupedOptions.map( ( option, index ) => (
                <li { ...getOptionProps( {  option, index } ) } key={ index } id = "searchItem">
                  { `${ option.artists.map( (_artist) => _artist.name ).join( ", " ) } - ${ option.name }` }
                </li>
              ))}
            </ul>
          ) : null}

          {/* clicking button calls the function to add song to queue */}
          <button className="queueButton" onClick={() => blockListRequest('block-list', cookie.get('roomCode'), songChoice.name) } style={{ backgroundColor: palette[1]}}>Add to Queue</button>

          {/* clicking button calls the function to block the song from queue */
            location.hash === '#/callback' ?
              <button className="queueButton" onClick={() => blockFromQueue()} style={{ backgroundColor: palette[1] }}>Block</button>
            : null
          }

          {/* clicking button calls the function to add song to queue */}
          <button className = "queueButton" onClick = { () => shuffleQueueBtn() } style={{ backgroundColor: palette[1]}}>Shuffle Queue</button>

          {/* temporary switch element to determine shuffle queue or in-order queue*/ }
          <label class="switch">
            <input type="checkbox" id="shuffleQueue">
            </input> Shuffle Queue
          </label>

          <Playlists/>

        </div>
        <Notification message={notifMessage}/>

      </div>
    </>
  );
}

export default Search