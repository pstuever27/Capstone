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
// Revised on: 2/24/2024
// Revision: Paul changed the routing from BrowserRouter to HashRouter because it works better on production builds 
// Preconditions: Must have npm and node installed to run in dev environment. Also see SpotifyAPI.js for its preconditions.
// Postconditions: Renders searchbar and queue screen which allows searching songs from spotify and adding / removing them from a queue data structure on screen.
// Error conditions: data.tracks is false, inputval.length is 0.
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------
import React, { useState } from 'react' // Need react
import './App.css' // imports styling for site
import Splash from './pages/splash' // Splash screen component (index)
import { useDispatch } from 'react-redux'; // Redux selector for information
import { HashRouter, Routes, Route } from "react-router-dom"; // Router is used to switch between pages

import Home from './pages/home'

import { setAddress } from './redux/serverAddressSlice'

function App() {

  //Setting the address of the server based on the current build type. If it's a dev build, then it's local. Otherwise it's the website
  const dispatch = useDispatch();

  //Set server address
  const address = import.meta.env.DEV == true ? "http://localhost:8000" : "https://songsync.live";
  dispatch(setAddress(address));

  return ( // this is what is returned to the webpage to be rendered
    // <SearchQueuePlayNow />
    <HashRouter> {/*HashRouter used for react routing*/}
      <Routes> {/*Create routes*/}
          <Route path="/"             element={<Splash />}  /> {/*Index element is the splash screen, will route to others from there*/}
          <Route path="join"          element={<Home   />}  /> {/*Join element gets routed to when joining a room*/}
          <Route path="host"          element={<Home   />}  /> {/*Host element gets routed to when hosting a room*/}
          <Route path="host/callback" element={<Home   /> } /> {/*Callback page will be the same as the homepage */}
      </Routes>
    </HashRouter>
  )
}
export default App // exporting the app to be imported and rendered in main.jsx