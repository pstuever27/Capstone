/**
 * Prolouge
 * File: home.jsx
 * Description: This page is the homepage after joining the room or hosting a room
 *              
 * Programmer(s): Paul Stuever
 * Date Created: 2/10/2024
 * 
 * Date Revised: 2/10/2024 - Moved Nick's changes here for compartmentalization
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

function Home() {
  // This is the queue data structure that stores the songs to be rendered on screen.
  // Its methods are imported from React's Queuestate: enqueue(), dequeue(), and peek().
  const [songQueue, modQueue] = useState([]);

  // Hook that grabs the makeRequest function and phpResponse state from phpAPI
  const { makeRequest } = phpAPI();

  const cookie = new Cookies();

  const dispatch = useDispatch();

  const location = useLocation();

  dispatch(setCode(cookie.get('roomCode')));

   useEffect(() => {
    const interval = setInterval(() => {
      makeRequest( 'room', cookie.get('roomCode'), null )
    }, 10000);
  
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])
  
  const enqueue = (song) => {
    modQueue([...songQueue, song]);
  }

  const dequeue = () => {
    modQueue(songQueue.slice(1));
  }

  const [palette, setPalette] = useState([]);

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

  const update = (colors) => {
    const darkened = colors.map((color) => darken(color));
    setPalette(darkened);
  }

  const getRoom = () => {
    fetch("../../data/.roomCode")
      .then((res) => res.text())
      .then((text) => {
        console.log(text);
        return text;
      })
      .catch((e) => console.error(e));
  }

  let roomCode = getRoom();

  return ( // this is what is returned to the webpage to be rendered
    // <SearchQueuePlayNow />
    <>
        <PaletteContext.Provider value={{ palette, update }}>
          <QueueContext.Provider value={{ songQueue, enqueue, dequeue }}>
            <div className="third" id="panel-1">
              <h1>Now Playing</h1>
              <NowPlaying />
            </div>
            <div className="third" id="panel-2">
              <h1>Your Room: { roomCode }</h1>
              <Queue />
            </div>

            <div className="third" id="panel-3">
              <h1>Search</h1>
              <Search />
            </div>
          </QueueContext.Provider>
          <Login />
        </PaletteContext.Provider>
    </>
  )
}
export default Home // exporting the app to be imported and rendered in main.j