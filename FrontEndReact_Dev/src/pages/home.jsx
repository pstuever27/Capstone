import React, { useState } from 'react' // Need react
import '../App.css' // imports styling for site
import Join from './join' // Join component
import Splash from './splash' // Splash screen component (index)
import Host from "./host" // Host component
import { useSelector, Provider } from 'react-redux'; // Redux selector for information
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Router is used to switch between pages
import Login from './login'
import Search from './search'
import Queue from './queue'
import SpotifyPlaylists from './playlists'

import QueueContext from './queueContext';
import NowPlaying from './nowPlaying'
import PaletteContext from './paletteContext'

function Home() {
  // This is the queue data structure that stores the songs to be rendered on screen.
  // Its methods are imported from React's Queuestate: enqueue(), dequeue(), and peek().
  const [songQueue, modQueue] = useState([]);

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

      let r = (toDecimal >> 16) - 40;
      if (r > 255) r = 255;
      if (r < 0) r = 0;

      let g = (toDecimal & 0x0000ff) - 40;
      if (g > 255) g = 255;
      if (g < 0) g = 0;

      let b = ((toDecimal >> 8) & 0x00ff) - 40;
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