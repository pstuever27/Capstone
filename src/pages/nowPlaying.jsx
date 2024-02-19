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
// Revised on: 02/05/2024
// Revision: Kieran added a simple delay to now playing so it doesn't overload our spotify call capacity. 
// Revised on: 02/09/2024
// Revision: Nicholas added color extraction from the album art to change the background color of the now playing screen, also modified the skip button. skip button is an image now!
// Revised on: 2/11/2024
// Revision: Kieran laid groundwork for skip's majority vote functionality.
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
import authorizationApi from '../authorizationApi';
import phpAPI from '../phpApi';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'
import { ColorExtractor } from 'react-color-extractor'
import QueueContext from './queueContext'; 
import { useContext } from 'react'; 
import PaletteContext from './paletteContext';
import Cookies from 'universal-cookie';


function NowPlaying() { 

  // State to hod the song object of the currently playing song
  const [nowPlayingSong, setNowPlayingSong] = useState( null ); 

  const { skipSong: skip, nowPlaying: getNowPlaying, phpResponse } = authorizationApi();


  //prep for majority skip
  const { makeRequest: guestListRequest, phpResponse: guestList } = phpAPI();
  //Get the roomcode and username from our redux store

  const cookie = new Cookies();

  const roomCode = cookie.get('roomCode')
  const username = cookie.get('username');

  const skipCounter = () => {
    console.log(roomCode); //there's something wrong with the way roomcode is being saved in other files. We'll investigate this further in next sprint to get the flow right
    guestListRequest("guest-list", roomCode, username); //Make php request to store the guest list array into "guestList" variable
    if(guestList==null || guestList.length==1){ //if only the host or one guest is joined, then it'll skip normally
      skip();
      getNowPlaying();
    }
    else{ //otherwise, majority of users must vote for skip
      //add mechanism to add vote to user attributes in database. we'll also need an attribute of the total number of votes
      //if(totalnumberofvotes >= guestList.length / 2){skip();}
    }
  }

  const location = useLocation();
  useEffect( () => {
    console.log(location);
    if(location.pathname == '/host/callback' || location == '/join') {
      getNowPlaying()
    }
  }, [location.pathname]);


  const { palette, update } = useContext( PaletteContext );

  const { songQueue, dequeue } = useContext( QueueContext );

  // useEffect is used to perform side effects in phpResponse
  // [phpResponse] syntax at the end uses phpResponse as a dependency for useEffect
  //  the getNowPlaying call alters phpResponse,in turn causing useEffect to run
  useEffect( () => { 
    const timer = setInterval(() => {
      if(window.location.pathname === '/host/callback' || window.location.pathname === '/join'){
        getNowPlaying();
      }
    }, 10000); //runs every 10.6 seconds

    if(phpResponse){
      if(phpResponse?.item){
        if( nowPlayingSong?.name != phpResponse?.item.name & nowPlayingSong?.artists != phpResponse?.item.artists ) {
          setNowPlayingSong(phpResponse.item);
          dequeue();
        }
      }
    }

    document.body.style.background = `linear-gradient(to bottom right, ${palette[0]}, #333333)`;

    return () => clearInterval(timer);
  }, [phpResponse, getNowPlaying] );

  var haveImg = nowPlayingSong?.album.images[1].url ? "block" : "none";

  /** RENDERED OUTPUT **/
  return ( 
    // This parent element to wrap all divs together in return statement
    <> 
      {/* NOW PLAYING PANEL */}
      
        {/* <h1>Now Playing</h1> */}
        {
          // CONDITION: if user is logged in, add the now playing song info. if not, show text saying to login
          ( window.location.pathname === '/host/callback' || window.location.pathname === '/join') 
          ? // IF TRUE
            <div id = "nowPlayingDiv">
              {/* clicking the song image opens the song in spotify */}
              <ColorExtractor getColors={colors => update( colors )}>
                <img id = "albumArt" src={ nowPlayingSong?.album.images[1].url } crossOrigin="anonymous"/>
              </ColorExtractor>
              <a href = { nowPlayingSong?.external_urls.spotify } target = '_blank' rel = "noreferrer" id = "breadcrumb" style={{ backgroundColor: palette[1], display: haveImg }}>Open in Spotify <b>&#9758;</b></a>
              <div id = "playback_info">
                <div id = "track_info">
                  <p id = "title">{nowPlayingSong?.name}</p>
                  <p id = "artists">{nowPlayingSong?.artists.map((_artist) => _artist.name).join(", ")}</p>
                </div>
                <img id = "skip" onClick = { () => {skip(); getNowPlaying();} } src = "/src/assets/skip.svg"/>
              </div>
            </div>
          : // ELSE IF FALSE
            // asks user to login if they're now logged in
            <h3 style={{}}>Login first (top right)</h3>
        }
    </>
  )
}

export default NowPlaying