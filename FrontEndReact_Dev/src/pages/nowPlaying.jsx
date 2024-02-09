import { useState } from 'react' 
import { useEffect } from 'react';
import { useHostAPI } from '../SpotifyAPI'; // imports useAPI function from SpotifyAPI.js for making spotify api calls

import authorizationApi from '../authorizationApi';

function NowPlaying() { 

  // State to hod the song object of the currently playing song
  const [nowPlayingSong, setNowPlayingSong] = useState( null ); 

  const { nowPlaying: getNowPlaying, phpResponse } = authorizationApi();

  // The reqPlayer object is taken from makeRequest function to perform Playback Control API cals. 
  // Example usage: reqPlayer('play') or pause reqPlayer('pause') 
  //
  // This call requires the user to login to retrieve the token, necessitating useHostAPI.
  // @reference https://developer.spotify.com/documentation/web-api 
  const { makeRequest: reqPlayer } = useHostAPI( 'https://api.spotify.com/v1/me/player' ); 

  // useEffect is used to perform side effects in reqPlayer
  // [reqPlayer] syntax at the end uses redPlayer as a dependency for useEffect
  //  any action that uses reqPlayer will cause useEffect to run
  useEffect( () => { 
    const timer = setInterval( () => { 
      if( window.location.pathname === '/callback' ) {
        getNowPlaying();
      }
    }, 100000 );

    if( phpResponse ) {
      if( phpResponse?.item ) {
        setNowPlayingSong( phpResponse.item );
      }
    }

    return () => clearInterval( timer );
  }, [ phpResponse, getNowPlaying ] ); 

  /** RENDERED OUTPUT **/
  return ( 
    // This parent element to wrap all divs together in return statement
    <> 
      {/* NOW PLAYING PANEL */}
      <div id = "nowPlayingDiv">
        {/* <h1>Now Playing</h1> */}
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
            <div>
              <p>{nowPlayingSong?.name} - {nowPlayingSong?.artists[0].name}</p>
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