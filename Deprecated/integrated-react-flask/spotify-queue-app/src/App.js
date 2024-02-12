// --------------------------------
// File: App.js
// Description: React component for interfacing with the Flask backend to add songs to a Spotify queue and display a song history. Users can input a Spotify track URL/URI, which is then sent to the backend, and the added song's details are displayed on the frontend.
// Programmer(s): Chinh Nguyen
// Created on: 2023-10-04
// Revised on: 2023-10-08
// Revision: Added comments
// Preconditions: The backend Flask server (akiqueue.py) must be running and accessible. The user must be logged into their Spotify account to add songs to the queue.
// Postconditions: The songs added by the user will be displayed in the song history.
// Error conditions: Handle cases where the server does not respond, or the user input is invalid.
// Side effects: None
// Invariants: None
// Faults: None
// --------------------------------

// Imports the useState hook from React, which allows us to use state in functional components
import React, { useState } from 'react'; // Import useState hook
import axios from 'axios'; // Import axios library for making HTTP requests

// Main component of our app
function App() { // Functional component
    const [trackURL, setTrackURL] = useState(''); // Declare state variables for track URL and history
    const [history, setHistory] = useState([]); // Declare state variables for track URL and history

    const handleSubmit = async (e) => { // Function to handle form submission
        e.preventDefault(); // Prevent default form submission behavior
        try { // Try to make a POST request to the backend
            const response = await axios.post('http://localhost:5000/add_song', { track_uri: trackURL }); // Make a POST request to the backend
            if (response.data.song_detail) { // If the response contains a song detail, add it to the history
                setHistory([...history, response.data.song_detail]); // Add the song detail to the history
            }
            alert(response.data.message); // Alert the user of the response message
        } catch (error) { // Catch any errors
            alert("Error: " + error.message); // Alert the user of the error
        }
    };

    const handleSpotifyLogin = async () => { // Function to handle Spotify login
      try { // Try to make a GET request to the backend
          let response = await axios.get('/login'); // Make a GET request to the backend
          if (response.data.url) { // If the response contains a URL, redirect the user to the URL
              window.location.href = response.data.url; // Redirect the user to the URL
          } // Otherwise, alert the user of the error
      } catch (error) { // Catch any errors
          alert('Error logging in to Spotify: ' + error.message); // Alert the user of the error
      }
  };
  
  // Return the JSX to render
    return (
        <div>
            <h2>Add Song to Spotify Queue</h2>
            <form onSubmit={handleSubmit}>
                <label>Spotify Track URL or URI:</label>
                <input 
                    type="text" 
                    value={trackURL} 
                    onChange={(e) => setTrackURL(e.target.value)} 
                />
                <button type="submit">Add to Queue</button>
            </form>
            <h3>Added Songs History</h3>
            <textarea readOnly value={history.join('\n')} />
            <br />
            <button onClick={handleSpotifyLogin}>Login to Spotify</button>
        </div>
    ); // End of return statement
}

export default App; // Export the App component
