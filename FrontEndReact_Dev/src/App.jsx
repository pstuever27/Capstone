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

import QueueContext from './pages/queueContext';
import NowPlaying from './pages/nowPlaying'

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

  const peek = () => {
    return songQueue[ 0 ];
  }



  return ( // this is what is returned to the webpage to be rendered
    // <SearchQueuePlayNow />
    <>
      <QueueContext.Provider value={{ songQueue, enqueue, dequeue }}>
        <Search/>
        <NowPlaying/>
        <Queue/>
      </QueueContext.Provider>
      <Login/>
    </>
  )
}
export default App // exporting the app to be imported and rendered in main.jsx