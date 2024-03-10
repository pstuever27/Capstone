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
// Revised on: 2/24/2024
// Revision: Kieran added skip voting functionality (votes are added to the database when clients click skip, votes reset when track changes).
// Revised on: 2/25/2024
// Revision: Kieran added the skiplock mechanism and further developed the skip voting functionality, syncronization, and made some minor optimizations. Also added the majority voting mechanism using the guest list size.
// Revised on: 3/2/2024
// Revision: Chinh removed dequeue in original song transition logic. Added local queue and fallbackTracks functionality. Uses nowPlaying information to determine when to add a song to the queue from the songQueue array or the fallbackTracks array.
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

import skipImg from '../images/skip.svg'


function NowPlaying() { 

  //Get the roomcode and username from our cookies
  const cookie = new Cookies();
  const roomCode = cookie.get('roomCode')
  const username = cookie.get('username');
  //skiplock sessionStorage cookie is first created and initialized to unlocked in splash.jsx. it is read and written to here to handle skip voting and locking mechanisms necessary for that.

  // State to hold the song object of the currently playing song
  const [nowPlayingSong, setNowPlayingSong] = useState( null ); 

  //API call handles for skipping to next track and getting currently playing track
  const { skipSong: skip, nowPlaying: getNowPlaying, phpResponse } = authorizationApi();
  
  // API call handle for adding a song to the queue
  const { addToQueue } = authorizationApi();


  //API call handles & other prep work for majority skip
  const { makeRequest: guestListRequest, phpResponse: guestList } = phpAPI();
  const { makeRequest: getSkipVotes, phpResponse: SkipVotes } = phpAPI();
  const { makeRequest: voteSkip, phpResponse: didVote } = phpAPI(); //used for editing the skipVotes counter value, either incrementing it or resetting it to 0 depending on the path argument
  const [ skipLocked, setSkipped ] = useState( false );  //boolean save state for ensuring that a user can only submit one vote towards skipping the current track

  /* 
    SKIP_USE_EFFECT : unlocks guests' skiplocks, executes majority skip via host
  */ 
  useEffect( () => { //this is very important useEffect for unlocking guests' skiplocks after a song has changed AND performing majority skip voting
    if(location.hash == '#/callback' || location.pathname == '/join') {
      if (SkipVotes?.skipVotes) {//if the current number of skipvotes in the table are 0, we can unlock the user's skiplock
        if (SkipVotes?.skipVotes[0] == 0) { //==0 is needed, as it should only unlock if the song has skipped and we're at 0 votes again
          sessionStorage.setItem('skipLock', 'unlocked'); //unlock skiplock for all users 
        }
      }
    }
    //we need this to only happen for host, so that duplicate skips aren't made by all the guests at once. doesn't run if guestList is null
    if (location.hash == '#/callback' && (sessionStorage.getItem('skipLock')=='unlocked')) {
      if (SkipVotes?.skipVotes) {
        if ((SkipVotes?.skipVotes[0] * 2) > (guestList?.length)) { //if we hit majority vote (more than half of guests vote), we can skip
          skip();
          getNowPlaying();
          console.log("Executing majority skip...");
          sessionStorage.setItem('skipLock', 'locked'); //needed to prevent duplicate skips. this temporarily locks the host from skipping anymore until all the asyncronous tasks (skipping track, resetting skipvotes to 0) are completed, where it is then unlocked along with all the guests at the top of this useEffect.
        }
      }
    }
  }, [SkipVotes, guestList]);
  
  const resetSkipVotes = () => {
    if(location.pathname=='/host/'){ //this is done to prevent the reset from occuring every time a new user joins the room or when someone refreshes their page
      voteSkip("reset-skip", roomCode, username); //resets database skip vote counter to 0
    }
  }

  const skipCounter = () => {
    console.log(`Current number of guests: ${guestList?.length}`);
    if(location.pathname=='/host/'){ //hosts can always skip, from the location.pathname=='/host/' condition.
      skip();
      getNowPlaying();
    }
    if(location.pathname=='/join' && (sessionStorage.getItem('skipLock')=='unlocked')){ //otherwise, majority of users must vote for skip. each user is only allowed to vote once, so if they've voted already for the track they won't be let into this block again until the track changes
      voteSkip("vote-skip", roomCode, username); //submit vote for skipping track
      sessionStorage.setItem('skipLock', 'locked'); //locks the user's voting priveledges since they've submitted their vote
      
      getSkipVotes("get-skip-votes", roomCode, username); //Make php request to get the current value of skipvotes in the room
    }
  }

  //runs when a change occurs in the url, allowing now playing to run once immediately upon logging in
  const location = useLocation();
  useEffect( () => {
    console.log(location);
    if(location.hash == '#/callback' || location.pathname == '/join') {
      getNowPlaying();
    }
  }, [location.pathname]);


  const { palette, update } = useContext( PaletteContext );

  const { songQueue, fallbackTracks, dequeue } = useContext( QueueContext );

  const playNextSong = async (time_to_end) => {
    // adjustable variable for the sake that Spotify's currently playing switches when crossfade starts
    // making it super hard to squeeze the next song in before the current song ends
    let crossfade_stupid = 6000; // right now, it seems like a good area is ~4s greater than crossfade.

    if (songQueue.length === 0) {
      console.log("Queue is empty, pulling from fallbackTracks");
      // Handle the case where the queue is empty
      if (fallbackTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * fallbackTracks.length);
        addToQueue(fallbackTracks[randomIndex]);
      } else {
        console.log("haha if you see this, you need to select a playlist and then hit \"Get Tracks of Selected Playlist\"");
      }
    } else {
      if (time_to_end < crossfade_stupid) {
        addToQueue(songQueue[0].uri);
        dequeue();
      } else {
        setTimeout(() => {
          addToQueue(songQueue[0].uri);
          dequeue();
        }, time_to_end - crossfade_stupid);
      }
    }
    
  }

  // useEffect is used to perform side effects in phpResponse
  // [phpResponse] syntax at the end uses phpResponse as a dependency for useEffect
  //  the getNowPlaying call alters phpResponse,in turn causing useEffect to run
  useEffect( () => { 
    const timer = setInterval(async () => {
      if(location.hash === '#/callback' || location.pathname === '/join'){
        console.log("Aki: Getting now playing...");
        let currentSong = await getNowPlaying();
        let time_to_end = currentSong?.item?.duration_ms - currentSong?.progress_ms;
        console.log("Current Position: " + currentSong?.progress_ms);
        console.log("Total Duration: " + currentSong?.item?.duration_ms);
        console.log("Time to end: " + time_to_end);
        if (time_to_end < 15000) {
          playNextSong(time_to_end);
        }

        getSkipVotes("get-skip-votes", roomCode, username); //needed to be known for both host and guests. host needs it for automatic majority skip; guests need it for having their skip buttons unlock when the track changes (see SKIP_USE_EFFECT above)
      }
      if(location.hash === '#/callback'){ //optimization to only make these calls on host end, since only the host will be computing whether there is majority vote for skip in the SKIP_USE_EFFECT side effect above
        guestListRequest("guest-list", roomCode, username); //Make php request to store the guest list array into "guestList" variable
      }
    }, 10000); //runs every 10.6 seconds

    // I think the dequeue function in here is obsolete now, since we have the playNextSong function!
    if(phpResponse){ //only runs if the phpResponse of the getNowPlaying call is different than it was last time we checked, so this code below only runs when the track changes.
      if(phpResponse?.item){
        if( nowPlayingSong?.name != phpResponse?.item.name & nowPlayingSong?.artists != phpResponse?.item.artists ) {
          resetSkipVotes();
          setNowPlayingSong(phpResponse.item); //sets our current track save state to the new track, so we can render the track's content on the screen as the track changes in spotify
          // dequeue();   //removes the previous track from our ui queue
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
          ( location.hash === '#/callback' || location.pathname === '/join') 
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
              <div>
                {(SkipVotes?.skipVotes)
                ? 
                  <p>{SkipVotes?.skipVotes[0]}</p>
                : null}
                  <img id="skip" className={(sessionStorage.getItem('skipLock')=='locked') ? "skiplock" : ""} onClick={() => { skipCounter(); }} src={skipImg} />
                </div>
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