//--------------------------------
// File: login.jsx (derived from App.jsx)
// Description: This react component handles the login flow. 
// Programmer(s): Nicholas Nguyen
// Created on: 01/19/2024
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
import { getAuthUrl, useHostAPI } from '../SpotifyAPI'; 

function Login() {
  // authUrl variable is used to store the url for the psotify login page
  const authUrl = getAuthUrl();

  // Function call for logging out from Spotify
  const { logout: logoutUser } = useHostAPI( '' );

  return (
    <>
      {/* div for dark/light mode toggle */}
      <div> 
        {   
          // if callback isn't in the url, it means the user hasn't logged into spotify yet, so we render the login button
          !( window.location.pathname === '/callback') 
          ? <button id = "login" onClick = { () => { window.location.href = `http://localhost:8000/Server/Spotify/authCreds.php?roomCode=ABCD`; } } >Login</button> 
          : <button id = "logout" onClick = { () => { logoutUser(); window.location.href = '/'; } } >Logout</button> 
        }
      </div>
    </>
  );
}

export default Login