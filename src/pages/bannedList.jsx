//--------------------------------
// File: Main.jsx
// Description: This is the react component that does the explicit rendering of the site
// Programmer(s): Rylan DeGarmo
// Created on: 2/26/2024
// Preconditions: npm and node must be installed for dev environment, spotify-web-api-js library must be installed
// Postconditions: Renders ban list for queue call prevention.
// Error conditions: None
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------

function BanList() {
    return (
        <div>
            
            <button id="SongBan" className="banButton" onClick={banSong} disabled={isLoading}>
                Add to Ban List
            </button>

            <button id="banShow" className="banButton" onClick={showBanned} disabled={isLoading}>
                Show Banned Songs
            </button>

        </div>
    );
}

export default BanList