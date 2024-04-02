/**
 * Prolouge
 * File: home.jsx
 * Description: This page is the homepage after joining the room or hosting a room
 *              
 * Programmer(s): Paul Stuever
 * Date Created: 2/10/2024
 * 
 * Date Revised: 2/10/2024 - Moved Nick's changes here for compartmentalization
 * Revision: 2/24/2024 - Paul Stuever - Added support for checking room status. 
 * 
 * Date Revised: 3/02/2024
 * Revision: Chinh Nguyen - Added implementation for fallbackTracks helper functions "setFallbackTracks" and "clearFallbackTracks"
 *
 * Date Revised: 3/09/2024
 * Revision: Chinh Nguyen - Added blocklist and addBlocklist function to QueueContext
 * 
 * Date Revised: 3/18/2024
 * Revision: Chinh Nguyen - Added setQueue implementation
 * 
 * Date Revised: 4/1/2024
 * Revision: Chinh Nguyen - Added moveRandomToFront() function to QueueContext
 * 
 * Preconditions: 
 *  @inputs : None 
 * Postconditions:
 *  @returns : 
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: 
 * **/

import React, { useState, useEffect } from 'react' // Need react
import '../App.css' // imports styling for site
import Login from './login'
import Search from './search'
import Queue from './queue'
import QueueContext from './queueContext';
import NowPlaying from './nowPlaying'
import PaletteContext from './paletteContext'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCode } from '../redux/roomCodeSlice'
import Cookies from 'universal-cookie'
import phpAPI from '../phpApi'
import SettingsDrawer from './drawer'
import LoginOverlay from './loginOverlay'

function Home() {
  // This is the queue data structure that stores the songs to be rendered on screen.
  // Its methods are imported from React's Queuestate: enqueue(), dequeue(), and peek().
  const [songQueue, modQueue] = useState([]);
  const [fallbackTracks, modFallback] = useState([]);
  const [blocklist, modBlocklist] = useState([]);

  // Hook that grabs the makeRequest function and phpResponse state from phpAPI
  const { makeRequest } = phpAPI();

  // const { toggleDrawer } = SettingsDrawer();

  const cookie = new Cookies(); //Using cookies for information passing

  //If there's no roomCode associated with the room, then kick the user out
  if (!cookie.get('roomCode')) {
    window.location.href = '/';
  }

  const dispatch = useDispatch(); //Redux

  const location = useLocation(); //Window location in react-router

  dispatch(setCode(cookie.get('roomCode'))); //Reset the roomCode in redux to the cookie's stored value

  //UseEffect will check if the room is currently open, but only from the guest's point of view
  useEffect(() => { //this is VERY important for multiple functions: automatically sends user back to splash screen if the host closes the room, AND sends a ping timestamp for the guest to the database so the host can detect whether they're still active or if they've left and should be automatically kicked for inactivity
    const interval = setInterval(() => { //Timer component
      if (location.pathname == '/join') {
        makeRequest('room', cookie.get('roomCode'), cookie.get('username')) //Runs room.php to see if the room is still open and pings to host
      }
    }, 10000); //Runs every 10 seconds. don't change this time interval as it is a factor of the ping calculations for the host determining if the guest left the page
  
    return () => clearInterval(interval); // clearInterval prevents memory leaks
  }, [])
  
  const enqueue = (song) => {
    modQueue([...songQueue, song]); //Adds song to our local queue
  }

  const dequeue = () => {
    modQueue(songQueue.slice(1)); //Removes song from our local queue
  }

  const setQueue = anotherQueue => {
    modQueue(anotherQueue); // replaces queue with another queue (will likely be a shuffled queue)
  }

  const moveRandomToFront = () => {
    const randomIndex = Math.floor(Math.random() * songQueue.length);
    const selectedSong = songQueue[randomIndex];
    const updatedQueue = [...songQueue];
    updatedQueue.splice(randomIndex, 1);
    updatedQueue.unshift(selectedSong);
    modQueue(updatedQueue);

    // Bug Testing
    console.log("Queue should have randomly pushed a song to the front of queue.");
    console.log(updatedQueue);
  }

  const setFallbackTracks = (tracks) => {
    modFallback(tracks);
  }

  const clearFallbackTracks = () => {
    modFallback([]);
  }

  const addBlocklist = (song) => {
    modBlocklist([...blocklist, song]);
  }

  const clearBlocklist = () => {
    modBlocklist([]);
  }

  //Palatte for background gradient
  const [palette, setPalette] = useState([]);

  //This function gets the colors needed for buttons and the gradient background based on the album art
  const darken = (hex) => {
    if (hex?.length === 7) {
      hex = hex.replace(`#`, ``);
      const toDecimal = parseInt(hex, 16);

      let r = (toDecimal >> 16) - 50;
      if (r > 255) r = 255;
      if (r < 0) r = 0;

      let g = (toDecimal & 0x0000ff) - 50;
      if (g > 255) g = 255;
      if (g < 0) g = 0;

      let b = ((toDecimal >> 8) & 0x00ff) - 50;
      if (b > 255) b = 255;
      if (b < 0) b = 0;

      return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    }

    else {
      return hex;
    }
  };

  //Updates the background colors
  const update = (colors) => {
    const darkened = colors.map((color) => darken(color));
    setPalette(darkened);
  }

  return ( // this is what is returned to the webpage to be rendered
    // <SearchQueuePlayNow />
    <>
        <PaletteContext.Provider value={{ palette, update }}>
        <QueueContext.Provider value={{ songQueue, fallbackTracks, blocklist, enqueue, dequeue, setQueue, moveRandomToFront, setFallbackTracks, addBlocklist, clearBlocklist }}>
            <div className="third" id="panel-1">
            <h1>Now Playing</h1> { /*NowPlaying component will show track information*/ }
              <NowPlaying />
            </div>
            <div className="third" id="panel-2">
              <h1>Your Room: { cookie.get('roomCode') }</h1>
              <Queue /> { /*Queue component shows information about current queue*/}
            </div>

            <div className="third" id="panel-3">
              <h1>Search</h1>
              <Search /> { /*Search component holds search bar, add to queue, and other functions*/}
          </div>
          {!(location.hash === "#/callback" || location.pathname === '/join')
            ? <LoginOverlay /> //LoginOverlay will show to tell the host that they need to login to use our app
            : null}
          <div id='drawerDiv' style={{ background: 'transparent'}}>
            <SettingsDrawer />
          </div>
          </QueueContext.Provider>
        </PaletteContext.Provider>
    </>
  )
}
export default Home // exporting the app to be imported and rendered in main.j