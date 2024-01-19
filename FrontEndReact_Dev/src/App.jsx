//--------------------------------
// File: App.jsx
// Description: This is the react component that handles the majority of the app frontend and functionality
// Programmer(s): Kieran Delaney, Chinh Nguyen, Nicholas Nguyen
// Created on: 9/21/2023
// 
// Revised on: 9/27/2023
// Revision: Kieran made the initial React prototype with an MUI search bar and queue. 
//            It allowed for searching dummy songs from a small array of strings, 
//            adding them to the queue to be rendered in the queue onscreen, 
//            and then removed from the queue with a button as well. 
// Revised on: 10/05/2023
// Revision: Kieran added spotify api calls to the search bar, and replaced the small 
//            dummy songs array with an array of the songs sourced from the spotify 
//            api responses.
// Revised on: 10/06/2023
// Revision: Kieran removed useEffect import from react as it is no longer needed, 
//            and set the image link and alt text to be for songsync
// Revised on: 10/21/2023
// Revision: Kieran reworked the search bar and searchresults data structure to 
//            retain all the spotify data of the track when adding it from the 
//            search bar to the queue, rather than losing the data after converting 
//            to a string as it was doing in the prototype previously. 
// Revised on: 10/21/2023
// Revision: Chinh added the login button to redirect to spotify login page and 
//            updated import getAuthUrl from SpotifyAPI.js
// Revised on: 10/22/2023
// Revision: Kieran added add to queue functionality by getting the code from the 
//            URL for the user's access token to add the song to their account's queue, 
//            and then calling the api function from SpotifyAPI.js
// Revised on: 10/22/2023
// Revision: Nicholas added styling for the background, queue list, 
//            search header, and buttons
// Revised on: 10/25/2023
// Revision: Kieran added a ternary switch to the login button to make it become 
//            a logout button after being pressed and having the user login. 
//            Clicking this logout button then clears the saved spotify token 
//            for the user who logged in, and returns the site back to its base address
// Revised on: 11/01/2023
// Revision: Kieran rewrote the queue to render using a single column dynamic MUI grid 
//            to render the songs top down as they're added to the queue
// Revised on: 11/02/2023
// Revision: Kieran ported the MUI grid to be a Mantine grid, as team has decided 
//            to change our UI system from MUI to Mantine
// Revised on: 11/08/2023
// Revision: Kieran added a screen to show the album art, name, and artist of a 
//            selected song from the search bar as a placeholder while developing 
//            the now playing screen
// Revised on: 11/09/2023
// Revision: Chinh added a replay song button and changed the styling of the buttons 
//            to be vertically stacked
// Revised on: 11/09/2023
// Revision: Chinh added a dark mode toggle and adjusted styling to be more uniform
//            with dark/light mode respectively.
// Revised on: 11/15/2023
// Revision: Kieran fixed the Now Playing section to correctly show the song art, 
//            name, and artist for the song currently playing in spotify.
// Revised on: 11/17/2023
// Revision: This used to be under the name App.jsx, but moved it all to this 
//            new file as a react page
// Revised on: 11/23/2023
// Revision: Nicholas added the blocked songs functionality, reorganized the 
//            code to improve clarity, and rewrote the comments to be more
//            readable. 
//
// Preconditions: Must have npm and node installed to run in dev environment. 
//                Also see SpotifyAPI.js for its preconditions.
// Postconditions: Renders searchbar and queue screen which allows searching songs from spotify and 
//                  adding / removing them from a queue data structure on screen.
// Error conditions: data.tracks is false, inputval.length is 0.
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------

/**
 *  @notes_from_nick  We need to rewrite the entirety of our front-end to user *either* Mantine or MUI
 *                    as our UI framework. Furthermore, I believe its necessary that we fragment `App.jsx`
 *                    into several component, each of which will be responsible for rendering. We need use
 *                    `App.jsx` as a `main.cpp` of sorts. 
 * 
 *                    Beyond that, I've refactored our code comments for clarity and readability on non-wide-screen
 *                    displays. 
 */

/**
 * @details import is used to bring in other functions, 
 *           objects or values from outside files or modules in the project. 
 * 
 *          The general syntax for import is either of the following:
 *           import { SpecificModule } from 'ModuleLocation';
 *           import DefaultModule from 'ModuleLocation';
 *          
 *          The specific module import is used when the module exports multiple items, 
 *           and you want to import only a few. 
 *          The default module import is used when the module exports only one item, 
 *           or you want to import the whole module.
 */

// useAPI, getAuthURl, and useHostAPI are necessary functions from SpotifyAPI.js
import { useAPI, getAuthUrl, useHostAPI } from './SpotifyAPI'; 

// useState is used to perform side effects in function components. 
// Side effects interact outside of the component. 
// 
// The `useEffect` hook takes two arguments: 
//  a function that contains the side-effect logic, 
//  and an array of dependencies. 
// The function runs after every render, including the first one. 
// However, if you provide an array of dependencies, 
// the function will only run when the dependencies have changed.
import { useState, useEffect } from 'react' 

// renders queue data structure
import { useQueueState } from "rooks"; 

// matine grid containers are used for dynamically rendering 
//  the queue on screens of varying sizes
import { Grid } from '@mantine/core'; 

// imports textfield component of material UI for input field of search bar
import TextField from '@mui/material/TextField'; 

// Autocomplete renders the search results of the search bar. 
import Autocomplete from '@mui/material/Autocomplete';

// CSS styling for the app
import './App.css' 


/**
 * @brief This is the main function that renders the webpage. 
 * @reference @notes_from_nick
 */ 
function App() { 
  // INITIALIZING STATE VARIABLES

  // The authUrl variable is used to store the url for the Spotify Login page.
  const authUrl = getAuthUrl(); 

  // Function call for logging out from spotify
  const { logout: logoutUser } = useHostAPI( '' ); 

  // This is the default inputVal (blank) for the search bar. 
  const [inputVal, setInputValue] = useState( "" ); 

  // reqSearch is a function used to search for the value stored at inputVal
  // The syntax `{ makeRequest: reqSearch }` uses JavaScript's destructuring assignment to 
  //  extract the `makeRequest` function from the object returned by `useAPI`. 
  //  It also renames `makeRequest` to `reqSearch` for use in this component.
  const { makeRequest: reqSearch } = useAPI( 'https://api.spotify.com/v1/search' ); 

  // An empty list state is used to store search results.
  // These search results will be rendered in the search bar dropdown. 
  const [searchResults, setSearchRes] = useState( [] ); 

  // A null-initialized save state is used to have its value set as
  //  the user-selected song from the search results. 
  const [songChoice, setSongChoice] = useState( null ); 

  // An empty list state is used to store the blocked songs.
  const [blockedSongs, setBlockedSong] = useState( [] ); 

  // This is the queue data structure that stores the songs to be rendered on screen.
  // Its methods are imported from React's Queuestate: enqueue(), dequeue(), and peek().
  const [songQueue, { enqueue, dequeue, peek }] = useQueueState( [] ); 

  // State to hold the song object of the currently playing song
  const [nowPlayingSong, setNowPlayingSong] = useState( null ); 
  
  const [dominantColor, setDominantColor] = useState( "#ffffff");

  // The reqPlayer object is taken from makeRequest function to perform Playback Control API cals. 
  // Example usage: reqPlayer('play') or pause reqPlayer('pause') 
  //
  // This call requires the user to login to retrieve the token, necessitating useHostAPI.
  // @reference https://developer.spotify.com/documentation/web-api 
  const { makeRequest: reqPlayer } = useHostAPI( 'https://api.spotify.com/v1/me/player' ); 

  // useEffect is used to perform side effects in reqPlayer
  // [reqPlayer] syntax at the end uses redPlayer as a dependency for useEffect
  //  any action that uses reqPlayer will cause useEffect to run
  useEffect( () => { 
    // Asynchronously performs API calls
    // The `code` formal parameter is a parsed element of the url for the currently playing song
    async function fetchData( code ) { 
      // Calls the `currently-playing` API request from reqPlayer component
      // `then` is a method used on promises. It takes a function as a paramter and runs it
      //  when the promise is successfully resolved.
      // `data` is the resulting value of the promise by reqPlayer, 
      //   which is executed when the promise is successfully resolved
      reqPlayer( `/currently-playing`, code ).then( ( data ) => {
          console.log( data.error.message + " " + data.error.status );
          console.log( data.item );
          // Checks whether data and data.item exist are are truthy.
          if( data && data.item ) { 
            // Sets the value of the Now Playing save state. 
            setNowPlayingSong( data.item ); 

            // sets the color of the webpage to the dominant color of the song
            getDominantColor( data.item.album.images[1].url ).then( ( color ) => {
              // sets the dominant color of the song to the dominant color of the song
              setDominantColor( color );
              // sets the background color of the webpage to the dominant color of the song
              document.documentElement.style.backgroundColor = color;
              
              // error handling
            } ).catch( ( error ) => {
              // output to console 
              console.log( error );
            } );
          } 
        } );
    }

    async function getDominantColor( imgURL ) {
      // return a promise because we're not actually trying to render another image
      return new Promise( ( resolve, reject ) => {
        // create a new image object
        const img = new Image();

        // set the source of the image to the url of the album art
        img.src = imgURL;

        // when the image loads, get the color of the top left pixel
        img.onload = function() {
          // create a new canvas element
          const canvas = document.createElement( "canvas" );

          // set the width and height of the canvas to the width and height of the image
          canvas.width = img.width;
          canvas.height = img.height;
    
          // draw the image onto the canvas
          const ctx = canvas.getContext( "2d" );
          ctx.drawImage( img, 0, 0, img.width, img.height );
    
          // get the pixel data from the image
          const imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );
          const data = imageData.data;
          
          // get the rgb values of the top left pixel
          const red = data[0];
          const green = data[1];
          const blue = data[2];
    
          // resolve the promise with the rgb values
          resolve(`rgb(${red}, ${green}, ${blue})`);
        };

        // if the image fails to load, reject the promise
        img.onerror = reject;
      });
    }

    // Spotify applications redirect to the callback page after login
    // If the user is logged into spotify, the suffix of the url will be `/callback`
    // otherwise, it will appear as `/`
    if( window.location.pathname === '/callback' ) { 
      // Parse the elements of the url, retain only the search query after `?` in the URL
      let urlParams = new URLSearchParams( window.location.search ); 

      // get the code from the url; if the url doesn't contain a code, set code variable to "empty"
      let code = urlParams.get( 'code' ) || "empty"; 
      
      // run the function above to get and set the now playing song 
      fetchData( code ); 
    }
  }, [reqPlayer] ); 

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
      enqueue( songChoice ); 

      // If the user has logged into spotify and the callback result is in the url bar
      if ( window.location.pathname === '/callback' ) { 
        // Parse the elements of the url, retain only the search query after `?` in the URL
        let urlParams = new URLSearchParams( window.location.search ); 

        // Get the code from the url; if the url doesn't contain a code, set code variable to "empty"
        let code = urlParams.get( 'code' ) || "empty";

        // calls the add to queue API request
        // `.then( () => {} )` literally does nothing. `then()` is required syntax. 
        reqPlayer( `/queue?uri = ${ encodeURIComponent( songChoice.uri ) }`, code ).then( () => {} )    
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
          enqueue(currentSong); 
          
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

  // toggleDarkMode makes use of a `false`-initialized save state
  // isDarkMode is a boolean, and setIsDarkMode toggles between true and false values. 
  const [isDarkMode, setIsDarkMode] = useState( false ); 

  /**
   * @brief read the next line to yourself.
   */ 
  async function toggleDarkMode() { 
    // flip between dark and lightmode.
    setIsDarkMode( !isDarkMode ); 

    // image element variable 
    let image = document.querySelector( 'img' ); 

    // button elements variable
    let buttons = document.querySelectorAll( 'button' ); 

    // switching to light mode
    if( isDarkMode ) { 
      // sets the background color of :root to green
      document.documentElement.style.backgroundColor = "#17DE92"; 

      // sets the text color of :root to black
      document.documentElement.style.color = "#000000"; 

      // sets the image to be inverted
      image.style.webkitFilter = 'invert(0)'; 

      // sets the image to be inverted
      image.style.filter = 'invert(0)'; 

      // for each button in the buttons variable
      buttons.forEach( button => { 
        // sets the background color of buttons to black
        button.style.backgroundColor = '#1a1a1a';  

        // sets the text color of buttons to white
        button.style.color = '#FFFFFF'; 
      } );
    } 

    // switching to dark mode
    else { 
      // sets the background color of :root to gray
      document.documentElement.style.backgroundColor = "#363636"; 

      // sets the text color of :root to white
      document.documentElement.style.color = "#FFFFFF"; 

      // sets the image to be inverted
      image.style.webkitFilter = 'invert(1)'; 

      // sets the image to be inverted
      image.style.filter = 'invert(1)'; 

      // for each button in the buttons variable
      buttons.forEach( button => { 
        // sets the background color of buttons to white
        button.style.backgroundColor = '#FFFFFF'; 

        // sets the text color of buttons to black
        button.style.color = '#000000'; 
      } );
    }
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
      setBlockedSong([...blockedSongs, songChoice]); // Add the selected song to the blockedSongs list
    }
  }

  /** RENDERED OUTPUT **/
  return ( 
    // This parent element to wrap all divs together in return statement
    <> 
      {/* div for site logo */}
      <div> 
        {/* when clicking on the Songsync logo, it will redirect to our website */}
        <a href="https://songsync.live" target="_blank" rel="noreferrer"> 

          {/* renders our songsync logo to the webpage */}
          <img src="./src/assets/logo.png" className="logo" alt="Songsync logo" /> 
        </a>
      </div>

      {/* div for search bar, using the searchDiv styling */}
      <div className="searchDiv"> 
        {/* renders search bar title with text shadow */}
        <h1 style={{left:500, float:'left', width: 'max-width'}}>Search</h1> 

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
          options = {searchResults} 

          // sets the width of the search box to be 300 px, font family to proxima-nova
          sx = { { width: 'max-width', fontFamily: 'proxima-nova' } } 

          // this ties it all together, rendering the textfield and search results based off the inputted params. 
          // the label "Search Songs" is the ghost placeholder text that renders in the text field when empty.
          renderInput = { ( params ) => <TextField { ...params } label = "Search Songs" sx = { { fontFamily: 'proxima-nova' } }/>} 
        />
        
        { /* this is the button stack below search bar */ }
        <div style = { { display: 'flex', flexDirection: 'column', alignItems: 'center' } }> 
          {/* clicking button calls the function to add song to queue */}
          <button 
            onClick = { () => addToQueue() } 
            style = { { 
              // 10px margins with 300px width
              margin: '10px',
              width: '300px' 
            } }
            >
            Add to Queue
          </button>

          {/* clicking button calls the function to add song to queue */}
          <button 
            onClick = { () => replaySong() } 
            style = { { 
              // 10px margins with 300px width
              margin: '10px', 
              width: '300px' 
            } }
            >
            Replay Song
          </button>

          {/* clicking button calls the function to block the song from queue */}
          <button 
            onClick = { () => blockFromQueue() } 
            // 10px margins with 300px width
            style = { { 
              left:500, 
              float:'right', 
              } }
            >
            Block from Queue
          </button>
        </div>

      </div>

      {/* NOW PLAYING PANEL */}
      <div style = { {
        //now playing div is 500px wide
        width: '500px' 
      } }
      >
        <h1>Now Playing</h1>
        
        {/* weirdo conditional statement in ts */}
        {
          // CONDITION: if user is logged in, add the now playing song info. if not, show text saying to login
          ( window.location.pathname === '/callback' ) 
          ? // IF TRUE
            <div>
              {/* clicking the song image opens the song in spotify */}
              <a href = { nowPlayingSong?.external_urls.spotify } target = '_blank' rel = "noreferrer"> 
                {/* gets the song's image from the nowplaying song object and renders it */}
                <img src={nowPlayingSong?.album.images[1].url}></img> 
              </a>
            <div>

            <p 
            
              style = { { 
                marginLeft:'100px',
                textAlign:'left', fontWeight:'bold', 
                fontSize:'15pt' } } > 
              <span style={{color:'black'}}>{nowPlayingSong?.name}</span><br></br><span style={{color:'grey'}}>{nowPlayingSong?.artists[0].name}</span> 
            </p>
            </div>
            </div>
          : // ELSE IF FALSE
            // asks user to login if they're now logged in
            <h3 style={{}}>Login first (top right)</h3>
        }
      </div>

      {/* queue div with qDiv css styling */}
      <div className = 'qDiv'> 
        {/* renders queue title with text shadow */}
        <h1 style={ { margin: '20px' } }>Queue</h1> 
        <div>
          <Grid
            // styling of the queue render
            style = { { 
              //400px wide
              width: '400px', 

              //font size is 20px
              fontSize: '20px', 

              //margins around queue render are 20px
              margin: '20px',  

              //rounded corners
              borderRadius: '5px' 
            } }
          >
          
          {/* maps through the songQueue array and renders each song in the queue as a grid row */}
          { songQueue.map( ( song ) => { 
            // return a grid column for the queue render
            return ( 
              <Grid.Col 
                // Single column grid
                span={ 12 } 

                // used for mapping from `songQueue` var
                key={ song.name } 

                //specifies the styling of these song bubble divs
                style={ {  
                  // padding is 5px between the text and the background bubble
                  padding: "5px", 

                  // specifies the color of the background of the song bubble
                  background: "#1189bd", 

                  // specifies how rounded the corners of the song bubble are
                  borderRadius: "5px", 

                  // distance between song bubbles within the queue render is 10 px
                  margin: "10px", 

                  // the song name is in the center of the bubble
                  textAlign: "center", 
                } }
              >
                {/* rendering the song name as the contents of the grid row */}
                { song.name } - { song.artists[0].name } 
              </Grid.Col>
            );})}
          </Grid>
        </div>
        
        {/* remove button that calls the dequeue function to remove the first element of the queue */}
        <button 
          style = { { 
            //20px margins around the button
            margin: '20px', 

            //width of the remove button is 200px
            width: '200px', 

            //corners of the remove button are rounded to 5px radius
            borderRadius: '5px' 
          } }

          // when clicking the remove button, the dequeue function runs, removing the first element from the queue
          onClick = { dequeue }
        > 
          {/* the text rendered on the button is "Remove" */}
          Remove 
        </button>
        
        {/* styling for the "Up Next" text and the song name next in the queue */}
        <p 
          style = { { 
            // font size is 20px
            fontSize: '20px', 

            //sets margin around this to be 20px
            margin: '20px'   
          } }
        >
          <span 
            // Overwrites the styling of the "Up Next:" portion to be smaller and bolder, 
            //  and then uses the queue peek function to render the song next up in the queue. 
            // The question mark between peek and name is needed in case there is nothing 
            //  in the queue so it doesn't try to call name on a lack of object
            style = { {
              fontSize:'15px',
              fontWeight:'bolder'
              } }
            >
              Up Next:
          </span>
          { peek()?.name }
        </p> 
      </div>
      
      {/* div for blocked songs */}
      <div className = 'blockDiv'> 
        {/* renders blocked songs title with text shadow */}
        <h1 stlye = { { margin:'20px' } }>Blocked Songs</h1> 
          {/* styling of the blocked songs render */}
          <div style = { { 
            // using flex display paradigm
            display: 'flex',  

            //rendering horizontally
            flexDirection: 'horizontal', 

            // 400px wide 
            width: '400px', 

            // 60 px tall
            height: '60px', 

            // font size is 20px
            fontSize: '20px', 

            // margins around blocked songs render are 20px
            margin: '20px',  
            background: 'rgba( 0, 0, 0, 0.2 )',

            // 5px border rad
            borderRadius: '5px'
          } }
          >
            { blockedSongs.map( ( item ) => { //maps each song of the blocked songs to a div rendering of the song name
              return ( //beings return statement that for arrow function
                <div   //returning a div component with styling of each item from the blocked songs
                  style = { {  //specifies the styling of these song bubble divs
                    width: "auto", //width is automatically set to best fit the text
                    padding: "5px", // padding is 5px between the text and the background bubble
                    height: "30px", // height of the song bubble is 30px
                    background: "#1189bd", //specifies the color of the background of the song bubble
                    borderRadius: "5px", //specifies how rounded the corners of the song bubble are
                    margin: "10px", //distance between song bubbles within the blocked songs render is 10 px
                    textAlign: "left", //the song name is in the center of the bubble
                  } }
                  
                  //sets the key of the div to be the name of the item from the blocked songs
                  key = { item.name } 
                >
                  {/* renders the name of the item from the blocked songs, in our case the song name */}
                  { item.name } 
                </div>
              );
            })}
        </div>
      </div> 

      {/* div for dark/light mode toggle */}
      <div style = { { 
        display: 'flex', 
        // row layout
        flexDirection: 'row', 

        // center items horizontally
        alignItems: 'center', 

        // position is absolute
        position: 'absolute', 

        // top padding = 10px;
        top: '10px', 

        // right padding = 10px;
        right: '10px',

        // 10px margin
        margin: '10px'
        } } 
      > 
        { /* this is the button stack in top right */ }
        <button onClick={() => toggleDarkMode()} style={{margin: '10px', width: '175px'}}>
          {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
        </button>
        
        {   
          // if callback isn't in the url, it means the user hasn't logged into spotify yet, so we render the login button
          !( window.location.pathname === '/callback') 
          ? // IF TRUE
            <button 
              onClick = { () => window.location = authUrl } 
              style = { { width: '175px' } }
            >
              {/* text rendering for Logging in */}
              Login to Spotify
            </button> 
          : // ELSE IF FALSE
            //if callback is in the url of the app, it means the user has logged into spotify, so we render the logout button instead
            
            <button 
              // button that clears users spotify token from our save states and refreshes app to the base url 
              onClick = { () => { 
                logoutUser(); 
                window.location.href = '/';
              } } 

              // styling for the logout button
              style = { { width: '175px' } }
            >
              {/* text rendering for Logging out */}
              Logout of Spotify
            </button> 
        }
      </div>
    </>
  )
}

// exporting the app to be imported and rendered in main.jsx
export default App