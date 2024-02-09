import React, { useState } from 'react' // Need react
import '../App.css' // imports styling for site
import Join from './join' // Join component
import Splash from './splash' // Splash screen component (index)
import Host from "./host" // Host component
import { useSelector } from 'react-redux'; // Redux selector for information
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Router is used to switch between pages
import Login from './login'
import Search from './search'
import Queue from './queue'
import SpotifyPlaylists from './pages/playlists'

import QueueContext from './pages/queueContext';
import NowPlaying from './pages/nowPlaying'

function App() {
  // This is the queue data structure that stores the songs to be rendered on screen.
  // Its methods are imported from React's Queuestate: enqueue(), dequeue(), and peek().
  const [songQueue, modQueue] = useState([]);

  const enqueue = (song) => {
    modQueue([...songQueue, song]);
  }

  const dequeue = () => {
    modQueue(songQueue.slice(1));
  }

  const peek = () => {
    return songQueue[0];
  }



  return ( // this is what is returned to the webpage to be rendered
    // <SearchQueuePlayNow />
    <>
      <QueueContext.Provider value={{ songQueue, enqueue, dequeue }}>
        <Search />
        <NowPlaying />
        <Queue />
        <SpotifyPlaylists />
      </QueueContext.Provider>
      <Login />
    </>
  )
}
export default App // exporting the app to be imported and rendered in main.j