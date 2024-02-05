//--------------------------------
// File: nowPlaying.jsx (derived from App.jsx)
// Description: This react component provides now playing logic. 
// Programmer(s): Kieran Delaney, Nicholas Nguyen
// Created on: 11/13/2023           
//
// Revised on: 11/15/2023
// Revision: Kieran added proper now playing functionality, to pull the track they're listening to and render the data on the screen. On Nov 13 when this was first created in app.jsx, the functionality was limited to just rendering the data of the song that the user would select in the search bar. 
// Revised on: 01/19/2024
// Revision: Nicholas moved the now playing functional components into this separate file to be imported into app.jsx to make full use of React's compartmental abilities. 
// Revised on: 02/04/2024
// Revision: Kieran fixed now playing to work under the new php call system, and a added skip button which calls the spotify skip function. this skips the currently playing track and moves to the next song in the queue. 
//
// Preconditions: Must have npm and node installed to run in dev environment. 
//                Also see SpotifyAPI.js for its preconditions.
// Postconditions: Renders now playing screen showing the contents of the user's currently playing song on the screen. Renders functioning skip button.
// 
// Error conditions: None
// Side effects: Now Playing track content is rendered if the user has logged in
// Invariants: None
// Faults: None
//--------------------------------

import { useState } from 'react' 
import { useEffect } from 'react';
//import { useTimer } from 'react-timer-hook';

import authorizationApi from '../authorizationApi';

function NowPlaying() { 

  // State to hod the song object of the currently playing song
  const [nowPlayingSong, setNowPlayingSong] = useState( null ); 

  const { skipSong: skip } = authorizationApi();
  const { nowPlaying: getNowPlaying, phpResponse } = authorizationApi();


  // useEffect is used to perform side effects in phpResponse
  // [phpResponse] syntax at the end uses phpResponse as a dependency for useEffect
  //  the getNowPlaying call alters phpResponse,in turn causing useEffect to run
  useEffect( () => { 
    if( window.location.pathname === '/callback' ) {  //very unoptimized solution. I will figure out a better way asap using timers and delays 
      getNowPlaying();
    }
    if(phpResponse){
      if(phpResponse?.item){
        setNowPlayingSong(phpResponse.item);
      }
    }
    
  }, [phpResponse] );

  /** RENDERED OUTPUT **/
  return ( 
    // This parent element to wrap all divs together in return statement
    <> 
      {/* NOW PLAYING PANEL */}
      <div id = "nowPlayingDiv">
        <h1>Now Playing</h1>
        {
          // CONDITION: if user is logged in, add the now playing song info. if not, show text saying to login
          ( window.location.pathname === '/callback' ) 
          ? // IF TRUE
            <div>
              {/* clicking the song image opens the song in spotify */}
              <a href = { nowPlayingSong?.external_urls.spotify } target = '_blank' rel = "noreferrer"> 
                {/* gets the song's image from the nowplaying song object and renders it */}
                <img src={nowPlayingSong?.album.images[1].url}></img> 
              </a>
              <button onClick = { () => {skip();getNowPlaying();} }>Skip</button>
            <div>
              <p>{nowPlayingSong?.name}</p>
              <p>{nowPlayingSong?.artists.map((_artist) => _artist.name).join(", ")}</p>
            </div>
            </div>
          : // ELSE IF FALSE
            // asks user to login if they're now logged in
            <h3 style={{}}>Login first (top right)</h3>
        }
      </div>
    </>
  )
}

export default NowPlaying