import React, { useState } from 'react';
import axios from 'axios';
// Make sure you install axios

function App() {
    const [trackURL, setTrackURL] = useState('');
    const [history, setHistory] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/add_song', { track_uri: trackURL });
            if (response.data.song_detail) {
                setHistory([...history, response.data.song_detail]);
            }
            alert(response.data.message);
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const handleSpotifyLogin = async () => {
      try {
          let response = await axios.get('/login');
          if (response.data.url) {
              window.location.href = response.data.url;
          }
      } catch (error) {
          alert('Error logging in to Spotify: ' + error.message);
      }
  };
  

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
    );
}

export default App;
