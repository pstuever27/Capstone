//--------------------------------
// File: login.jsx (derived from App.jsx)
// Description: This react component handles the login flow. 
// Programmer(s): Nicholas Nguyen
// Created on: 01/19/2024
//
// Revised on: 02/24/2024
// Revision: Nicholas added PaletteContext to the component and made the button have a dynamic background color
// Revision: Paul added login functionality for new php api stuff
// Revision: Paul added overlay functionality and fixed login buttons to show based on host/join status
//
// Preconditions: Must have npm and node installed to run in dev environment. 
//                Also see SpotifyAPI.js for its preconditions.
// Postconditions: Handles queue data structure and rendering
// 
// Error conditions: 
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------

// useAPI, getAuthURl, and useHostAPI are necessary functions from SpotifyAPI.js

// imports useContext hook from react
import { useContext, useEffect } from 'react'; 
import Cookies from 'universal-cookie';
import { useLocation } from 'react-router-dom'
import authorizationApi from '../authorizationApi';
import LoginOverlay from './loginOverlay';
import phpAPI from '../phpApi';
import { useSelector } from 'react-redux';


// imports palette context to manipulate color palette across components
import PaletteContext from './paletteContext';

//Init function. @returns component
function Login() {

  //Palatte colors
  const { palette } = useContext(PaletteContext);

  //logoutUser function will do necessary functions on server side for logging out of Spotify
  const { logout: logoutUser } = authorizationApi();

  //makeRequest takes care of roomCode php functions
  const { makeRequest, phpResponse } = phpAPI();

  //Window location
  const location = useLocation();

  //Gets current cookies associated
  const cookie = new Cookies();

  //Sets local roomCode for use 
  const roomCode = cookie.get('roomCode');

  //Gets serverAddress for php calls
  const { serverAddress } = useSelector(store => store.serverAddress);


  //Used for closing the room. 'ok' status says the room was closed, or that the user has successfully left the room
  useEffect(() => {
    if (phpResponse) {
      if (phpResponse.status == 'ok') {
        window.location.href = '/'; //Goes back to the splash screen
      }
    }
  }, [phpResponse])

  // Function call for logging out from Spotify
  return (
    <>
      {/* div for dark/light mode toggle */}
      <div> 
        { (location.pathname != '/join')
          ?// if callback isn't in the url, it means the user hasn't logged into spotify yet, so we render the login button 
          <>
            {(location.hash == '#/callback')
              ? // Shows text on login button based on if you are logged into Spotify or not
              <button id="logout" style={{ backgroundColor: palette[1] }} onClick={() => { logoutUser(); window.location.href = '/#/host'; }} >Logout</button>
              :
              <button id="logout" style={{ backgroundColor: palette[1] }} onClick={() => { window.location.href = `${serverAddress}/Server/Spotify/authCreds.php?roomCode=${roomCode}`; }} >Login</button>
            }
            <button id="close" style={{ backgroundColor: palette[1] }} onClick={() => { makeRequest("close-room", roomCode, null); }}>Close Room</button> 
            {!(location.hash === "#/callback")
              ? <LoginOverlay /> //LoginOverlay will show to tell the host that they need to login to use our app
              : null}
            </>
          :
            //If they are a guest, they can leave the room with this button
           <button id="logout" style={{ backgroundColor: palette[1] }} onClick={() => { window.location.href = '/'; }} >Leave</button> //TODO: Add php for guest leaving that removes them from SQL
        }
      </div>
    </>
  );
}

export default Login