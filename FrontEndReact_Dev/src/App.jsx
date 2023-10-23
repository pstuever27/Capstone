//--------------------------------
// File: App.jsx
// Description: This is the react component that handles the majority of the app frontend and functionality
// Programmer(s): Kieran Delaney, Chinh Nguyen
// Created on: 9/21/2023
// Revised on: 9/27/2023
// Revision: Kieran made the initial React prototype with an MUI search bar and queue. It allowed for searching dummy songs from a small array of strings, adding them to the queue to be rendered in the queue onscreen, and then removed from the queue with a button as well. 
// Revised on: 10/05/2023
// Revision: Kieran added spotify api calls to the search bar, and replaced the small dummy songs array with an array of the songs sourced from the spotify api responses.
// Revised on: 10/06/2023
// Revision: Kieran removed useEffect import from react as it is no longer needed, and set the image link and alt text to be for songsync
// Revised on: 10/21/2023
// Revision: Kieran reworked the search bar and searchresults data structure to retain all the spotify data of the track when adding it from the search bar to the queue, rather than losing the data after converting to a string as it was doing in the prototype previously. 
// Revised on: 10/21/2023
// REvision: Chinh added the login button to redirect to spotify login page and updated import getAuthUrl from SpotifyAPI.js
// Preconditions: Must have npm and node installed to run in dev environment. Also see SpotifyAPI.js for its preconditions.
// Postconditions: Renders searchbar and queue screen which allows searching songs from spotify and adding / removing them from a queue data structure on screen.
// Error conditions: data.tracks is false, inputval.length is 0.
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------
import { useState } from 'react' // imports useState from react to allow saving of the search results (and other future variables as needed) across the webpage over render cycles
import { useQueueState } from "rooks"; // imports usequeuestate from available react hooks for the queue data structure rendering 
import './App.css' // imports styling for site
import TextField from '@mui/material/TextField'; // imports textfield component of material UI for input field of search bar
import Autocomplete from '@mui/material/Autocomplete'; // imports autocomplete component of material UI for dynamically rendering search results of search bar
import { useAPI, getAuthUrl } from './SpotifyAPI'; // imports useAPI function from SpotifyAPI.js for making spotify api calls

// for use when importing proxima nova
// import Proxima_Nova from 'https://use.typekit.net/wwk0mzk.css';

function App() { // app function to wrap all the contents of the webpage
  const [searchResults, setSearchRes] = useState([]); // state to save search results to be rendered in search bar
  //spotify api call initizations 
  const { makeRequest: reqSearch } = useAPI('https://api.spotify.com/v1/search'); //initializes spotify search base url api call, and sets the reqSearch alias to call makeRequest from the useAPI function definition
  const authUrl = getAuthUrl(); // gets the auth url from the getAuthUrl function in SpotifyAPI.js
  //add more api call types later as needed, like const { makeRequest: reqPlayer } = useAPI('https://api.spotify.com/v1/me/player'), which could then be used to do play calls reqPlayer('play') or pause reqPlayer('pause') or other functions as specified in the url appending options documented at https://developer.spotify.com/documentation/web-api under REFERENCE > Player
  const { makeRequest: qAdd } = useAPI('https://api.spotify.com/v1/me/player/queue?uri=');

  async function addToQueue(){
    if(songChoice!=null){
      enqueue(songChoice); //adds valid song to queue on screen
      qAdd(`${encodeURIComponent(songChoice.uri)}`)
        .then(()=>{})
    }

    setSongChoice(null); //resets the song choice to be empty
  }

  // DANGER COMMIT: GET CURRENT PLAYING SONG BUTTON
  const { makeRequest: getCurrentPlayingSong } = useAPI('https://api.spotify.com/v1/me/player/currently-playing');

  async function showCurrentPlayingSong() {
    const currentPlaying = await getCurrentPlayingSong();
    if (currentPlaying && currentPlaying.item) {
      alert(`Currently playing: ${currentPlaying.item.name} by ${currentPlaying.item.artists.map(artist => artist.name).join(', ')}`);
    } else {
      alert('No song currently playing.');
    }
  }

  async function search(){ // search function which is calls spotify api search
    if(inputVal.length==0){ return; } // if the search bar is empty, don't try to do api calls and simply return to skip
    reqSearch(`?q=${inputVal}&type=track`) // calling the search api call, appending the search query with with search bar field input as the track name being requested
      .then( // after the asyncronous promise of the api call is fulfilled, we'll perform the callback function below
        data => { // take the json 'data' variable from the SpotifyAPI.js makeRequest return statement as the parameter of the function
          if(!data.tracks){ //handle invalid searches
            return; // if no spotify tracks correspond to the search bar input text, return to skip. otherwise we'll try to access track and artist name data that isn't available and get errors.
          }
          console.log(data); // print spotify request json data to the browser's console. useful for navigating through the json structure with the gui dropdowns as a reference on how to access certain data you need within it
          setSearchRes(data.tracks.items.map(item=>item)) // adds each spotify track data object into our array
        }
      )
  }

  const [songChoice, setSongChoice] = useState(null); // uses a null-initialized save state to set the song that the user selects from the search results to memory for being inserted into the queue
  const [inputVal, setInputValue] = useState(""); // uses a save state to set the text that the user is typing into the search bar to a variable for passing into the api calls and other uses throughout the program
  const [songQueue, { enqueue, dequeue, peek }] = useQueueState([]); // uses the queuestate react save state to maintain the state of the queue over render cycles, and includes the enqueue, dequeue, and peek queue methods for the songQueue alias

  // this will allow us to override the typography in mui
  // const font_override = createTheme({
  //   typography: {
  //     fontFamily: 'proxima-nova, Arial, Helvetica, sans-serif',
  //   },
  //   components: {
  //     MuiCssBaseLine: {
  //       styleOverrides: 
  //       `
  //         @font-face {
  //           font-family: 'proxima-nova';
  //           font-style: normal;
  //           font-display: swap;
  //           font-weight: 400;
  //           src: url( ${ Proxima_Nova } ), format( 'woff2' )
  //           unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
  //         }
  //       `,
  //     },
  //   },
  // });

  return ( // this is what is returned to the webpage to be rendered
    <> {/* parent element to wrap all divs together in return statement */}
      {/* <ThemeProvider theme={font_override}>
        <CssBaseline /> 
      </ThemeProvider> */}
      {/* in use for overriding mui font */}

      <div> {/* div for site logo */}
        <a href="https://songsync.live" target="_blank" rel="noreferrer"> {/* when clicking on the Songsync logo, it will redirect to our website */}
          <img src="./src/assets/logo.png" className="logo" alt="Songsync logo" /> {/* renders our songsync logo to the webpage */}
        </a>
      </div>
      <div className="searchDiv"> {/* div for search bar, using the searchDiv styling */}
      <h1 style={{left:500, float:'left', width: 'max-width'}}>Search</h1> {/* renders search bar title with text shadow */}
        <Autocomplete  // autocomplete MUI component for rendering the search results under the search bar as the user types
          disablePortal  // allows for customizing the style of the popper component, which isn't possible for portal-based autocomplete components
          autoHighlight // automatically does a focused highlight on the first search result, so the user can quickly type and hit the enter key on that top result, or use the arrow keys to select a different one from the list
          noOptionsText={'Oops! Nothing :('} // this makes it so that when there are no search options for the inputted text, it will just be a blank empty space below, rather than showing "No options" or other text there. This looks more streamlined.
          id="search-box" //sets the html id of this autocomplete tag to be search-box
          value={songChoice} // sets the song that the user selected from the search results list to the songChoice save state
          inputValue={inputVal} // saves the text inputted to the search bar by the user to the inputVal save state
          onInputChange={(event, newInputValue) => { //when the user is typing in the search bar, the new text is passed in through the newInputValue argument. the event arguement can be used later if needed, but is required to be listed for the function to work.
            setInputValue(newInputValue); // saves the new text typed in the search bar to the inputvalue state
            if(newInputValue!="") search(); // runs the search function to get the spotify search results based off the text the user inputted
          }}
          onChange={(event, newValue) => { // when the user selects a different search result, the new selected value is passed into this function
            setSongChoice(newValue); // the new song is saved in the songChoice state
          }}
          isOptionEqualToValue={(option,value)=>`${option.name} - ${option.artists[0].name}`===`${value.name} - ${value.artists[0].name}`} //used to eliminate a warning
          getOptionLabel={searchResult => `${searchResult.name} - ${searchResult.artists[0].name}`} //renders the song option text in the dropdown in the format "Track - Artist"
          options={searchResults} // the "options" prop takes an array of what will be shown as the listed options that the user can search through. These are set to the searchResults array filled with spotify search results from the search() function
          sx={{ width: 'max-width', fontFamily: 'proxima-nova' }} // sets the width of the search box to be 300 px, font family to proxima-nova
          renderInput={(params) => <TextField {...params} label="Search Songs" sx={{ fontFamily: 'proxima-nova' }}/>} // this ties it all together, rendering the textfield and search results based off the inputted params. the label "Search Songs" is the ghost placeholder text that renders in the text field when empty.
        />
        
        <button onClick={() => addToQueue()} style={{left:500, float:'right',}}>Add to Queue</button>{/* clicking button calls the function to add song to queue */}
        <button onClick={() => window.location = authUrl} style={{ left: 400, float: 'left' }}>Login to Spotify</button>{/* button that redirects the user to the spotify login page */}
        <button onClick={showCurrentPlayingSong} style={{ left: 600, float: 'right', }}>Show Current Playing Song</button>{/* DANGER COMMIT, NEW BUTTON? */}

      </div>
      <div className='qDiv'> {/* queue div with qDiv css styling */}
      <h1 style={{ margin: '20px' }}>Queue</h1> {/* renders queue title with text shadow */}
        <div style={{ //styling of the queue render
            display: 'flex',  // using flex display paradigm
            flexDirection: 'horizontal', //rendering horizontally
            width: '400px', //400px wide
            height: '60px', //60 px tall
            fontSize: '20px', //font size is 20px
            margin: '20px',  //margins around queue render are 20px
            // borderTop: '2px solid green', //the top and bottom borders are 2px of green
            // borderBottom: '2px solid green'
            background: 'rgba( 0, 0, 0, 0.2 )',
            borderRadius: '5px'
        }}>
            {songQueue.map((item) => { //maps each song of the queue to a div rendering of the song name
              return ( //beings return statement that for arrow function
                <div   //returning a div component with styling of each item from the queue
                  style={{  //specifies the styling of these song bubble divs
                    width: "auto", //width is automatically set to best fit the text
                    padding: "5px", // padding is 5px between the text and the background bubble
                    height: "30px", // height of the song bubble is 30px
                    background: "#1189bd", //specifies the color of the background of the song bubble
                    borderRadius: "5px", //specifies how rounded the corners of the song bubble are
                    margin: "10px", //distance between song bubbles within the queue render is 10 px
                    textAlign: "left", //the song name is in the center of the bubble
                  }}
                  key={item.name} //sets the key of the div to be the name of the item from the queue
                >
                  {item.name} {/* renders the name of the item from the queue, in our case the song name */}
                </div>
              );
          })}
        </div>
        <button style={{ //styling the remove button
            margin: '20px', //20px margins around the button
            width: '200px', //width of the remove button is 200px
            borderRadius: '5px' //corners of the remove button are rounded to 5px radius
        }}
            onClick={dequeue}> {/* when clicking the remove button, the dequeue function runs, removing the first element from the queue */}
            Remove {/* the text rendered on the button is "Remove" */}
        </button>
        <p style={{ //styling for the "Up Next" text and the song name next in the queue
            color: '#000000', //color is black
            fontSize: '20px', //font size is 20px
            margin: '20px'   //sets margin around this to be 20px
        }}><span style={{fontSize:'15px',fontWeight:'bolder'}}>Up Next:</span>  {peek()?.name}</p> {/* overwrites the styling of the "Up Next:" portion to be smaller and bolder, and then uses the queue peek function to render the song next up in the queue. the question mark between peek and name is needed in case there is nothing in the queue so it doesn't try to call name on a lack of object */}
      </div>
      <p className="read-the-docs"> {/* uses the "read-the-docs" styling on this text */}
        Dev Build [React + Vite + MaterialUI] {/* specifies what tools are being used to render this page */}
      </p>
    </>
  )
}

export default App // exporting the app to be imported and rendered in main.jsx