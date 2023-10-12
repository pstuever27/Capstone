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
// Revision: Removed useEffect import from react as it is no longer needed, and set the image link and alt text to be for songsync
// Revised on: 10/12/2023
// Revision: Added the spotify login button and functionality to the app, and added the spotify api calls to the queue to allow for play/pause functionality of the queue
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
import { useAPI } from './SpotifyAPI'; // imports useAPI function from SpotifyAPI.js for making spotify api calls
import env from '../client.json' // importing the spotify dev app client ID and secret from our local json file 
const CLIENT_ID = env.CLIENT_ID; // sets the client ID to the one imported from the json file
const REDIRECT_URI = "http://localhost:3000/callback"; // sets the redirect uri to be the local host for now, but will be changed to our website later
const SCOPES = ["playlist-read-private", "app-remote-control"].join(" "); // sets the scopes to be the ones we need for our app to function
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`; // sets the auth url to be the spotify auth url with the client id, redirect uri, and scopes appended to it

function App() { // app function to wrap all the contents of the webpage
  const [searchResults, setSearchRes] = useState([]); // state to save search results to be rendered in search bar
  //spotify api call initizations 
  const { makeRequest: reqSearch } = useAPI('https://api.spotify.com/v1/search'); //initializes spotify search base url api call, and sets the reqSearch alias to call makeRequest from the useAPI function definition
  //add more api call types later as needed, like const { makeRequest: reqPlayer } = useAPI('https://api.spotify.com/v1/me/player'), which could then be used to do play calls reqPlayer('play') or pause reqPlayer('pause') or other functions as specified in the url appending options documented at https://developer.spotify.com/documentation/web-api under REFERENCE > Player

  async function search(){ // search function which is calls spotify api search
    if(inputVal.length==0){ return; } // if the search bar is empty, don't try to do api calls and simply return to skip
    reqSearch(`?q=${inputVal}&type=track`) // calling the search api call, appending the search query with with search bar field input as the track name being requested
      .then( // after the asyncronous promise of the api call is fulfilled, we'll perform the callback function below
        data => { // take the json 'data' variable from the SpotifyAPI.js makeRequest return statement as the parameter of the function
          if(!data.tracks){ //handle invalid searches
            return; // if no spotify tracks correspond to the search bar input text, return to skip. otherwise we'll try to access track and artist name data that isn't available and get errors.
          }
          console.log(data); // print spotify request json data to the browser's console. useful for navigating through the json structure with the gui dropdowns as a reference on how to access certain data you need within it
          setSearchRes(data.tracks.items.map(item => `${item.name} - ${item.artists[0].name}`)) // maps each spotify track result to a place in the searchResults array, in the format "TrackName - ArtistName"
        }
      )
  }

  const [songChoice, setSongChoice] = useState(""); // uses a save state to set the song that the user selects from the search results to memory for being inserted into the queue
  const [inputVal, setInputValue] = useState(""); // uses a save state to set the text that the user is typing into the search bar to a variable for passing into the api calls and other uses throughout the program
  const [songQueue, { enqueue, dequeue, peek }] = useQueueState([]); // uses the queuestate react save state to maintain the state of the queue over render cycles, and includes the enqueue, dequeue, and peek queue methods for the songQueue alias

  return ( // this is what is returned to the webpage to be rendered
    <> {/* parent element to wrap all divs together in return statement */}
      <div> {/* div for site logo */}
        <a href="https://songsync.live" target="_blank" rel="noreferrer"> {/* when clicking on the Songsync logo, it will redirect to our website */}
          <img src="./src/assets/logo.png" className="logo" alt="Songsync logo" /> {/* renders our songsync logo to the webpage */}
        </a>
      </div>
      <div className="searchDiv"> {/* div for search bar, using the searchDiv styling */}
      <h1 style={{textShadow:'1px 1px 2px black'}}>Search Bar Prototype</h1> {/* renders search bar title with text shadow */}
        <Autocomplete  // autocomplete MUI component for rendering the search results under the search bar as the user types
          disablePortal  // allows for customizing the style of the popper component, which isn't possible for portal-based autocomplete components
          autoHighlight // automatically does a focused highlight on the first search result, so the user can quickly type and hit the enter key on that top result, or use the arrow keys to select a different one from the list
          noOptionsText={''} // this makes it so that when there are no search options for the inputted text, it will just be a blank empty space below, rather than showing "No options" or other text there. This looks more streamlined.
          id="search-box" //sets the html id of this autocomplete tag to be search-box
          value={songChoice} // sets the song that the user selected from the search results list to the songChoice save state
          inputValue={inputVal} // saves the text inputted to the search bar by the user to the inputVal save state
          onInputChange={(event, newInputValue) => { //when the user is typing in the search bar, the new text is passed in through the newInputValue argument. the event arguement can be used later if needed, but is required to be listed for the function to work.
            setInputValue(newInputValue); // saves the new text typed in the search bar to the inputvalue state
            search(); // runs the search function to get the spotify search results based off the text the user inputted
          }}
          onChange={(event, newValue) => { // when the user selects a different search result, the new selected value is passed into this function
            setSongChoice(newValue); // the new song is saved in the songChoice state
          }}
          options={searchResults} // the "options" prop takes an array of what will be shown as the listed options that the user can search through. These are set to the searchResults array filled with spotify search results from the search() function
          sx={{ width: 300,}} // sets the width of the search box to be 300 px
          renderInput={(params) => <TextField {...params} label="Search Songs" />} // this ties it all together, rendering the textfield and search results based off the inputted params. the label "Search Songs" is the ghost placeholder text that renders in the text field when empty.
        />
        
        <button onClick={() => {enqueue(songChoice);setSongChoice("")}} style={{left:500, float:'right',}}>Add to Queue</button>{/* button that adds the selected song to the queue and resets the songchoice to be empty */}
        <button onClick={() => window.location = AUTH_URL} style={{left:400, float:'left'}}>Login to Spotify</button>{/* button that redirects the user to the spotify login page */}
        
      </div>
      <div className='qDiv'> {/* queue div with qDiv css styling */}
      <h1 style={{ margin: '20px', textShadow:'1px 1px 2px black' }}>Queue</h1> {/* renders queue title with text shadow */}
        <div style={{ //styling of the queue render
            display: 'flex',  // using flex display paradigm
            flexDirection: 'horizontal', //rendering horizontally
            width: '400px', //400px wide
            height: '60px', //60 px tall
            fontSize: '20px', //font size is 20px
            margin: '20px',  //margins around queue render are 20px
            borderTop: '2px solid green', //the top and bottom borders are 2px of green
            borderBottom: '2px solid green'
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
                    textAlign: "center", //the song name is in the center of the bubble
                  }}
                  key={item} //sets the key of the div to be the name of the item from the queue
                >
                  {item} {/* renders the content of the item from the queue, in our case the song name */}
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
        }}><span style={{fontSize:'15px',fontWeight:'bolder'}}>Up Next:</span>  {peek()}</p> {/* overwrites the styling of the "Up Next:" portion to be smaller and bolder, and then uses the queue peek function to render the song next up in the queue */}
      </div>
      <p className="read-the-docs"> {/* uses the "read-the-docs" styling on this text */}
        Using React + Vite + MaterialUI {/* specifies what tools are being used to render this page */}
      </p>
    </>
  )
}

export default App // exporting the app to be imported and rendered in main.jsx