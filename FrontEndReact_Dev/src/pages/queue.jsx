import { useState } from 'react' // imports useState from react to allow saving of the search results (and other future variables as needed) across the webpage over render cycles
import { useEffect } from 'react';
import { useQueueState } from "rooks"; // imports usequeuestate from available react hooks for the queue data structure rendering 
import '../App.css' // imports styling for site
import TextField from '@mui/material/TextField'; // imports textfield component of material UI for input field of search bar
import Autocomplete from '@mui/material/Autocomplete'; // imports autocomplete component of material UI for dynamically rendering search results of search bar
import { Grid, createTheme } from '@mantine/core'; //mantine grid container for dynamically rendering queue on screens of varying sizes
import { useAPI, getAuthUrl, useHostAPI } from '../SpotifyAPI'; // imports useAPI function from SpotifyAPI.js for making spotify api calls
    
// for use when importing proxima nova
// import Proxima_Nova from 'https://use.typekit.net/wwk0mzk.css';

function Queue() { // app function to wrap all the contents of the webpage
    const [searchResults, setSearchRes] = useState([]); // state to save search results to be rendered in search bar
    //spotify api call initizations 
    const { makeRequest: reqSearch } = useAPI('https://api.spotify.com/v1/search'); //initializes spotify search base url api call, and sets the reqSearch alias to call makeRequest from the useAPI function definition
    const authUrl = getAuthUrl(); // gets the auth url from the getAuthUrl function in SpotifyAPI.js
    //add more api call types later as needed, like const { makeRequest: reqPlayer } = useAPI('https://api.spotify.com/v1/me/player'), which could then be used to do play calls reqPlayer('play') or pause reqPlayer('pause') or other functions as specified in the url appending options documented at https://developer.spotify.com/documentation/web-api under REFERENCE > Player
    const { makeRequest: reqPlayer } = useHostAPI('https://api.spotify.com/v1/me/player'); //must use the useHostAPI since this call needs the token from the user who logged in 
    const { logout: logoutUser } = useHostAPI(''); //function call for logging out from spotify


    useEffect(() => {
        async function fetchData(code){
        reqPlayer(`/currently-playing`, code) // calling the search api call, appending the search query with with search bar field input as the track name being requested
        .then( // after the asyncronous promise of the api call is fulfilled, we'll perform the callback function below
            data => { // take the json 'data' variable from the SpotifyAPI.js makeRequest return statement as the parameter of the function
        console.log(data); // print spotify request json data to the browser's console. useful for navigating through the json structure with the gui dropdowns as a reference on how to access certain data you need within it
        //  setCurrentSong(data);
        }
    )
        }
        if(window.location.pathname === '/callback'){
        let urlParams = new URLSearchParams(window.location.search); //parse the elements of the url
        let code = urlParams.get('code') || "empty";

        fetchData(code);
        }
    },[reqPlayer]);

    async function addToQueue() {
        if (songChoice != null) {
            enqueue(songChoice); //adds valid song to queue on screen
            if (window.location.pathname === '/callback') { //if user has logged into spotify and the callback result is in the url bar
                let urlParams = new URLSearchParams(window.location.search); //parse the elements of the url
                let code = urlParams.get('code') || "empty"; //gets code from the url, or sets code variable to "empty" if the url doesn't contain a code
                reqPlayer(`/queue?uri=${encodeURIComponent(songChoice.uri)}`, code) //calls the add to queue API request
                    .then(() => { })    //nothing to return 
            }
            else alert("Must login to add song to Spotify queue."); //if the url doesn't contain callback, it means they didn't login to spotify first 
        }

        setSongChoice(null); //resets the song choice to be empty
    }

    async function replaySong() {
        if (window.location.pathname === '/callback') { // if user has logged into spotify and the callback result is in the url bar
            let urlParams = new URLSearchParams(window.location.search); // parse the elements of the url
            let code = urlParams.get('code') || "empty"; // gets code from the url, or sets code variable to "empty" if the url doesn't contain a code
            reqPlayer(`/currently-playing`, code) // calls the currently-playing API request
                .then((data) => {
                    if (data && data.item) { // check if there is a currently playing song
                        const currentSong = data.item;
                        enqueue(currentSong); // adds the current song to the queue on screen
                        reqPlayer(`/queue?uri=${encodeURIComponent(currentSong.uri)}`, code) // calls the add to queue API request
                            .then(() => { }) // nothing to return
                    } else {
                        alert("No song is currently playing on Spotify."); // if there is no currently playing song, show an alert
                    }
                })
        } else {
            alert("Must login to replay song from Spotify."); // if the user is not logged in, show an alert
        }
    }

    const [isDarkMode, setIsDarkMode] = useState(false); // initialize state for dark mode

    async function toggleDarkMode() { // function to toggle dark mode
        setIsDarkMode(!isDarkMode); // toggle the state of dark mode

        let image = document.querySelector('img'); // image element variable 
        let buttons = document.querySelectorAll('button'); // button elements variable
        if (isDarkMode) { // switching to light mode
            document.documentElement.style.backgroundColor = "#17DE92"; // sets the background color of :root to green
            document.documentElement.style.color = "#000000"; // sets the text color of :root to black
            image.style.webkitFilter = 'invert(0)'; // sets the image to be inverted
            image.style.filter = 'invert(0)'; // sets the image to be inverted
            buttons.forEach(button => { // for each button in the buttons variable
                button.style.backgroundColor = '#1a1a1a';  // sets the background color of buttons to black
                button.style.color = '#FFFFFF'; // sets the text color of buttons to white
            });
        } else { // switching to dark mode
            document.documentElement.style.backgroundColor = "#363636"; // sets the background color of :root to gray
            document.documentElement.style.color = "#FFFFFF"; // sets the text color of :root to white
            image.style.webkitFilter = 'invert(1)'; // sets the image to be inverted
            image.style.filter = 'invert(1)'; // sets the image to be inverted
            buttons.forEach(button => { // for each button in the buttons variable
                button.style.backgroundColor = '#FFFFFF'; // sets the background color of buttons to white
                button.style.color = '#000000'; // sets the text color of buttons to black
            });
        }
    }

    const buttonText = isDarkMode ? "Light" : "Dark"; // set the button text based on the current state of dark mode

    async function search() { // search function which is calls spotify api search
        if (inputVal.length == 0) { return; } // if the search bar is empty, don't try to do api calls and simply return to skip
        reqSearch(`?q=${inputVal}&type=track`) // calling the search api call, appending the search query with with search bar field input as the track name being requested
            .then( // after the asyncronous promise of the api call is fulfilled, we'll perform the callback function below
                data => { // take the json 'data' variable from the SpotifyAPI.js makeRequest return statement as the parameter of the function
                    if (!data.tracks) { //handle invalid searches
                        return; // if no spotify tracks correspond to the search bar input text, return to skip. otherwise we'll try to access track and artist name data that isn't available and get errors.
                    }
                    console.log(data); // print spotify request json data to the browser's console. useful for navigating through the json structure with the gui dropdowns as a reference on how to access certain data you need within it
                    setSearchRes(data.tracks.items.map(item => item)) // adds each spotify track data object into our array
                }
            )
    }

    const [songChoice, setSongChoice] = useState(null); // uses a null-initialized save state to set the song that the user selects from the search results to memory for being inserted into the queue
    const [inputVal, setInputValue] = useState(""); // uses a save state to set the text that the user is typing into the search bar to a variable for passing into the api calls and other uses throughout the program
    const [songQueue, { enqueue, dequeue, peek }] = useQueueState([]); // uses the queuestate react save state to maintain the state of the queue over render cycles, and includes the enqueue, dequeue, and peek queue methods for the songQueue alias
    const [currentSong, setCurrentSong] = useState(null);

    // this will allow us to override the typography in mui
    const font_override = createTheme({
    typography: {
        fontFamily: 'proxima-nova, Arial, Helvetica, sans-serif',
    },
    components: {
        MuiCssBaseLine: {
        styleOverrides:
        `
            @font-face {
            font-family: 'proxima-nova';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: url( ${ Proxima_Nova } ), format( 'woff2' )
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
            }
        `,
        },
    },
    });

return(<> {/* parent element to wrap all divs together in return statement */}
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
        noOptionsText={'Oops! Nothing :('} // this makes it so that when there are no search options for the inputted text, it will just be a blank empty space below ' ' or it will say 'Oops! Nothing :(' depending on what's in this parameter, rather than showing the "No options" default. This looks more streamlined.
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
    {
        !(window.location.pathname === '/callback') ? //if callback isn't in the url, it means the user hasn't logged into spotify yet, so we render the login button
        <button onClick={() => window.location = authUrl} style={{ left: 400, float: 'left' }}>Login to Spotify</button> /* button that redirects the user to the spotify login page */
        : //if callback is in the url of the app, it means the user has logged into spotify, so we render the logout button instead
        <button onClick={() => {logoutUser(); window.location.href = '/';}} style={{ left: 400, float: 'left' }}>Logout of Spotify</button> /* button that clears users spotify token from our save states and refreshes app to the base url */
    }

    </div>
    <div className='qDiv'> {/* queue div with qDiv css styling */}
    <h1 style={{ margin: '20px' }}>Queue</h1> {/* renders queue title with text shadow */}
    <div>
        <Grid
        style={{ //styling of the queue render
            width: '400px', //400px wide
            fontSize: '20px', //font size is 20px
            margin: '20px',  //margins around queue render are 20px
            borderRadius: '5px' //rounded corners
        }}
        >
        {songQueue.map((song) => { //maps each song of the queue to a div rendering of the song name
        return ( //beings return statement that for arrow function
        <Grid.Col 
            span={12} //this makes it so the grid is a single column
            key={song.name} //used for iterating of map from SongQueue
            style={{  //specifies the styling of these song bubble divs
            padding: "5px", // padding is 5px between the text and the background bubble
            background: "#1189bd", //specifies the color of the background of the song bubble
            borderRadius: "5px", //specifies how rounded the corners of the song bubble are
            margin: "10px", //distance between song bubbles within the queue render is 10 px
            textAlign: "left", //the song name is in the center of the bubble
            }}
        >
            {song.name} {/* rendering the song name as the contents of the grid row */}
        </Grid.Col>
        );})}
    </Grid>
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
);

}

export default Queue;