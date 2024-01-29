import { useState } from 'react' 
import { useEffect } from 'react';
import { useHostAPI } from '../SpotifyAPI'; // imports useAPI function from SpotifyAPI.js for making spotify api calls

function NowPlaying() { 

  // State to hod the song object of the currently playing song
  const [nowPlayingSong, setNowPlayingSong] = useState( null ); 

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
    // Asynchronously performs API calls
    // The `code` formal parameter is a parsed element of the url for the currently playing song
    async function fetchData( code ) { 
      // Calls the `currently-playing` API request from reqPlayer component
      // `then` is a method used on promises. It takes a function as a paramter and runs it
      //  when the promise is successfully resolved.
      // `data` is the resulting value of the promise by reqPlayer, 
      //   which is executed when the promise is successfully resolved
      reqPlayer( `/currently-playing`, code ).then( ( data ) => {
          console.log( data.error.message + " " + data.error.status );
          // Checks whether data and data.item exist are are truthy.
          if( data && data.item ) { 
            // Sets the value of the Now Playing save state. 
            setNowPlayingSong( data.item ); 
          } 
        } );
    }

    // Spotify applications redirect to the callback page after login
    // If the user is logged into spotify, the suffix of the url will be `/callback`
    // otherwise, it will appear as `/`
    if( window.location.pathname === '/callback' ) { 
      // Parse the elements of the url, retain only the search query after `?` in the URL
      let urlParams = new URLSearchParams( window.location.search ); 

      // get the code from the url; if the url doesn't contain a code, set code variable to "empty"
      let code = urlParams.get( 'code' ) || "empty"; 
      
      // run the function above to get and set the now playing song 
      fetchData( code ); 
    }
  }, [reqPlayer] ); 

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