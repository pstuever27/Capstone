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
import { useContext } from 'react'; 
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import authorizationApi from '../authorizationApi';

// imports palette context to manipulate color palette across components
import PaletteContext from './paletteContext';

function Login() {

  const { serverAddress } = useSelector(store => store.serverAddress);

  const { roomCode } = useSelector(store => store.roomCode);

  const { palette } = useContext(PaletteContext);

  const { logout: logoutUser } = authorizationApi();

  const location = useLocation();

  // Function call for logging out from Spotify
  return (
    <>
      {/* div for dark/light mode toggle */}
      <div> 
        { (location.pathname != '/join')
          ?
            // if callback isn't in the url, it means the user hasn't logged into spotify yet, so we render the login button
            !(location.hash === "#/callback") 
            ? <button id = "login" onClick = { () => { window.location.href = `${serverAddress}/Server/Spotify/authCreds.php?roomCode=${roomCode}`; } } >Login</button> 
            : <button id = "logout" style={{backgroundColor: palette[1] }} onClick = { () => { logoutUser(); window.location.href = '/#/host'; } } >Logout</button> 
          :
            <button id = "logout" style={{backgroundColor: palette[1] }} onClick = { () => { window.location.href = '/'; } } >Leave</button> 
          
        }
      </div>
    </>
  );
}

export default Login