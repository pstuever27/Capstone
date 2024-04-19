//--------------------------------
// File: queue.jsx (derived from App.jsx)
// Description: This react component provides queue logic. 
// Programmer(s): Nicholas Nguyen
// Created on: 01/19/2024
//
// Revised on: 02/09/2024
// Revision: Nicholas changed the way song titles were being displayed in the queue
//            also added color palette context to change the color of the dequeue button
// Revised on: 04/15/2024
// Revision: Kieran added an 'x' button to the end of each song rendered in the queue which removes that track from the queue when clicked
//            also removed the dequeue button as we don't need it now, and made is so if they queue is empty it prints a little grey message letting the user know
// Revised on: 04/19/2024
// Revision: Kieran added a play next up arrow button that moves the song to the top of the queue
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

// imports queue context
import QueueContext from './queueContext'; 

// for determining if user is a host or guest
import { useLocation } from 'react-router-dom'

// imports useContext hook from react
import { useContext } from 'react'; 

// imports palette context to manipulate color palette across components
import PaletteContext from './paletteContext';

import authorizationApi from '../authorizationApi';

function Queue() {
  const { songQueue, setQueue } = useContext( QueueContext );
  const { palette } = useContext( PaletteContext );
  const location = useLocation();

  return (
    <>
        <div id = "queueDiv"> 
          {/* <h1>Queue</h1> */}
          <div id = "queueGrid">       
            {/* maps through the songQueue array and renders each song in the queue as a grid row */}
            { (songQueue?.length == 0)
              ? //true
              <p style={{color:"lightgrey"}}>Queue is empty.</p>
              : //false
              songQueue?.map( ( song, index ) => { 
                // return a grid column for the queue render; renders artist name and title
                return( <div id = "queueGridCol" span={ 12 } key={ index } >
                  <p id = "qname">
                   <span id = "playNext" className={(index==0 || location.pathname === '/join') ? "hideTrackButtons" : ""} onClick={() => { 
                      //puts current track to top of queue with '↑' being clicked from queue
                      const modifiedQueue = songQueue.filter(songs => songs !== song); //first we remove the track from where it is
                      let front = [song]; 
                      setQueue(front.concat(modifiedQueue)); //puts song to the front so it can be played next, and updates the queue with these changes
                    }} >&#10514;</span> {/* "&#10514;" renders the up-arrow-bar symbol on the screen as a play next symbol to be clicked */}
                    
                    { song.name }
                    
                    <span id = "qremove" className={(location.pathname === '/join') ? "hideTrackButtons" : ""} onClick={() => { 
                      const modifiedQueue = songQueue.filter(songs => songs !== song); //removes current track with 'x' being clicked from queue
                      setQueue(modifiedQueue); //updates the queue to no longer have that removed track
                    }} >&times;</span> {/* "&times;" renders the 'X' symbol on the screen as a remove symbol to be clicked */}
                  </p>
                  <p id = "qartists">
                    { song.artists.map((_artist) => _artist.name).join(", ") }
                  </p>
                </div> );
              } ) } 
          </div>
        </div>
    </>
  );
}

export default Queue