//--------------------------------
// File: App.jsx
// Description: This is the react component that handles the majority of the app frontend and functionality
// Programmer(s): Kieran Delaney, Chinh Nguyen, Nicholas Nguyen
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
// Revision: Chinh added the login button to redirect to spotify login page and updated import getAuthUrl from SpotifyAPI.js
// Revised on: 10/22/2023
// Revision: Kieran added add to queue functionality by getting the code from the URL for the user's access token to add the song to their account's queue, and then calling the api function from SpotifyAPI.js
// Revised on: 10/22/2023
// Revision: Nicholas added styling for the background, queue list, search header, and buttons
// Revised on: 10/25/2023
// Revision: Kieran added a ternary switch to the login button to make it become a logout button after being pressed and having the user login. Clicking this logout button then clears the saved spotify token for the user who logged in, and returns the site back to its base address
// Revision on: 11/19/2023
// Revision: Nicholas added Blocked Songs functionality and reordered some of the <div> elements
// Revision on: 1/31/2024
// Revision: Chinh added SpotifyPlaylists component to render user's Spotify playlists
// Revised on: 02/09/2024
// Revision: Nicholas added PaletteContext and added CSS for mobile UI and general desktop UI. added darken function so white text looks consistently good.
// Preconditions: Must have npm and node installed to run in dev environment. Also see SpotifyAPI.js for its preconditions.
// Postconditions: Renders searchbar and queue screen which allows searching songs from spotify and adding / removing them from a queue data structure on screen.
// Error conditions: data.tracks is false, inputval.length is 0.
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------
import React, { useState } from 'react' // Need react
import './App.css' // imports styling for site
import Join from './pages/join' // Join component
import Splash from './pages/splash' // Splash screen component (index)
import Host from "./pages/host" // Host component
import { useSelector } from 'react-redux'; // Redux selector for information
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Router is used to switch between pages
import Login from './pages/login'
import Search from './pages/search'
import Queue from './pages/queue'
import Playlists from './pages/playlists'


import QueueContext from './pages/queueContext';
import NowPlaying from './pages/nowPlaying'
import PaletteContext from './pages/paletteContext'

function App() {
  // This is the queue data structure that stores the songs to be rendered on screen.
  // Its methods are imported from React's Queuestate: enqueue(), dequeue(), and peek().
  const [ songQueue, modQueue ] = useState( [] );

  const enqueue = ( song ) => {
    modQueue( [ ...songQueue, song ] );
  }

  const dequeue = () => {
    modQueue( songQueue.slice( 1 ) );
  }

  const [ palette, setPalette ] = useState( [] );

  const darken = ( hex ) => {   
    if( hex?.length === 7 ) {
      hex = hex.replace(`#`, ``);
      const toDecimal = parseInt( hex, 16 );

      let r = ( toDecimal >> 16 ) - 40;
      if( r > 255 ) r = 255;
      if( r < 0 ) r = 0;

      let g = ( toDecimal & 0x0000ff ) - 40;
      if( g > 255 ) g = 255;
      if( g < 0 ) g = 0;

      let b = ( ( toDecimal >> 8 ) & 0x00ff ) - 40;
      if( b > 255 ) b = 255;
      if( b < 0 ) b = 0;

      return `#${ ( g | ( b << 8 ) | ( r << 16 ) ).toString( 16 ) }`;
    }
    
    else {
      return hex;
    }
  };

  const update = ( colors ) => {
    const darkened = colors.map( ( color ) => darken( color ) );
    setPalette( darkened );
  }

  return ( // this is what is returned to the webpage to be rendered
    // <SearchQueuePlayNow />
    <>
      <PaletteContext.Provider value={{ palette, update }}>
        <QueueContext.Provider value={{ songQueue, enqueue, dequeue }}>
          <div className="third" id = "panel-1">
            <h1>Now Playing</h1>
            <NowPlaying/>
          </div>

          <div className="third" id = "panel-2">
            <h1>Your Room</h1>
            <Queue/>
          </div>

          <div className="third" id = "panel-3">
            <h1>Search</h1>
            <Search/>
          </div>
        </QueueContext.Provider>
        <Login/>
      </PaletteContext.Provider>
    </>
  )
}
export default App // exporting the app to be imported and rendered in main.jsx