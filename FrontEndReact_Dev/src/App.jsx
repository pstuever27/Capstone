//--------------------------------
// File: App.jsx
// Description: This is the react component that handles the majority of the app frontend and functionality
// Programmer(s): Kieran Delaney, Chinh Nguyen, Nicholas Nguyen, Paul Stuever
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
// Revised on: 11/01/2023
// Revision: Kieran rewrote the queue to render using a single column dynamic MUI grid to render the songs top down as they're added to the queue
// Revised on: 11/02/2023
// Revision: Kieran ported the MUI grid to be a Mantine grid, as team has decided to change our UI system from MUI to Mantine
// Revised on: 11/08/2023
// Revision: Kieran added a screen to show the album art, name, and artist of a selected song from the search bar as a placeholder while developing the now playing screen
// Revised on: 11/09/2023
// Revision: Chinh added a replay song button and changed the styling of the buttons to be vertically stacked
// Revised on: 11/09/2023
// Revision: Chinh added a dark mode toggle and adjusted styling to be more uniform with dark/light mode respectively.
// Revised on: 11/15/2023
// Revision: Kieran fixed the Now Playing section to correctly show the song art, name, and artist for the song currently playing in spotify.
// Revision on: 11/17/2023
// Revision: Paul moved all queue screen functionality to separate component (queue.jsx) and made changes to allow for routing and displaying basic components
// Preconditions: Must have npm and node installed to run in dev environment. Also see SpotifyAPI.js for its preconditions.
// Postconditions: Renders searchbar and queue screen which allows searching songs from spotify and adding / removing them from a queue data structure on screen.
// Error conditions: data.tracks is false, inputval.length is 0.
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------
import React from 'react' // Need react
import './App.css' // imports styling for site
import Join from './pages/join' // Join component
import Splash from './pages/splash' // Splash screen component (index)
import Host from "./pages/host" // Host component
import { useSelector } from 'react-redux'; // Redux selector for information
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Router is used to switch between pages

function App(){

  return ( // this is what is returned to the webpage to be rendered
    <BrowserRouter> {/*Browserrouter used for react routing*/}
      <Routes> {/*Create routes*/}
        <Route path="/">
          <Route index element={<Splash />} /> {/*Index element is the splash screen, will route to others from there*/}
          <Route path="join" element={<Join />} /> {/*Join element gets routed to when joining a room*/}
          <Route path="host" element={<Host />} /> {/*Host element gets routed to when hosting a room*/}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App // exporting the app to be imported and rendered in main.jsx