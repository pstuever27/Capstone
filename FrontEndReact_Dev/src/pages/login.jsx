//--------------------------------
// File: login.jsx (derived from App.jsx)
// Description: This react component handles the login flow. 
// Programmer(s): Nicholas Nguyen
// Created on: 01/19/2024
//
// Revised on: 02/09/2024
// Revision: Nicholas added PaletteContext to the component and made the button have a dynamic background color
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

// imports palette context to manipulate color palette across components
import PaletteContext from './paletteContext';

function Login() {
  const { palette } = useContext( PaletteContext );

  // Function call for logging out from Spotify
  return (
    <>
      {/* div for dark/light mode toggle */}
      <div> 
        {   
          // if callback isn't in the url, it means the user hasn't logged into spotify yet, so we render the login button
          !( window.location.pathname === '/callback') 
          ? <button id = "login" onClick = { () => { window.location.href = `http://localhost:8000/Server/Spotify/authCreds.php?roomCode=ABCD`; } } >Login</button> 
          : <button id = "logout" style={{backgroundColor: palette[1] }} onClick = { () => { logoutUser(); window.location.href = '/'; } } >Logout</button> 
        }
      </div>
    </>
  );
}

export default Login