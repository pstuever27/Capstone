//--------------------------------
// File: login.jsx (derived from App.jsx)
// Description: This react component handles the login flow. 
// Programmer(s): Nicholas Nguyen
// Created on: 01/19/2024
//
// Revised on: 02/12/2024
// Revision: Nicholas added PaletteContext to the component and made the button have a dynamic background color
// Revision: Paul added login functionality for new php api stuff
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

// imports palette context to manipulate color palette across components
import PaletteContext from './paletteContext';

function Login() {

  const { palette } = useContext(PaletteContext);

  const { logout: logoutUser } = authorizationApi();

  const { makeRequest, phpResponse } = phpAPI();

  const location = useLocation();

  const cookie = new Cookies();

  const roomCode = cookie.get('roomCode')

  useEffect(() => {
    if (phpResponse) {
      if (phpResponse.status == 'ok') {
        window.location.href = '/';
      }
    }
  }, [phpResponse])

  // Function call for logging out from Spotify
  return (
    <>
      {/* div for dark/light mode toggle */}
      <div> 
        { (location.pathname != '/join')
          ?
            // if callback isn't in the url, it means the user hasn't logged into spotify yet, so we render the login button
            !(location.hash === "#/callback") 
            ? <LoginOverlay />
            :
            <>
            <button id="logout" style={{ backgroundColor: palette[1] }} onClick={() => { logoutUser(); window.location.href = '/#/host'; }} >Logout</button> 
            <button id="close" style={{ backgroundColor: palette[1] }} onClick={() => { makeRequest("close-room", roomCode, null); }}>Close Room</button> 
            </>
          :
           <button id="logout" style={{ backgroundColor: palette[1] }} onClick={() => { window.location.href = '/'; }} >Leave</button> 
        }
      </div>
    </>
  );
}

export default Login