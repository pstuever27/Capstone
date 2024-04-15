//--------------------------------
// File: queue.jsx (derived from App.jsx)
// Description: This react component provides queue logic. 
// Programmer(s): Nicholas Nguyen
// Created on: 01/19/2024
//
// Revised on: 02/09/2024
// Revision: Nicholas changed the way song titles were being displayed in the queue
//            also added color palette context to change the color of the dequeue button
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

// imports useContext hook from react
import { useContext } from 'react'; 

// imports palette context to manipulate color palette across components
import PaletteContext from './paletteContext';

import authorizationApi from '../authorizationApi';

function Queue() {
  const { songQueue, dequeue } = useContext( QueueContext );
  const { palette } = useContext( PaletteContext );

  return (
    <>
        <div id = "queueDiv"> 
          {/* <h1>Queue</h1> */}
          <div id = "queueGrid">       
            {/* maps through the songQueue array and renders each song in the queue as a grid row */}
            { songQueue?.map( ( song ) => { 
              // return a grid column for the queue render; renders artist name and title
              return( <div id = "queueGridCol" span={ 12 } key={ song.name } >
                <p id = "qname">
                  { song.name }
                  <span id = "qremove" onClick={() => { alert("bean"); }} >&times;</span>
                </p>
                <p id = "qartists">{ song.artists.map((_artist) => _artist.name).join(", ") }</p>
              </div> );
            } ) } 
          </div>
          <button id = "dequeue" onClick = { dequeue } style={{ backgroundColor: palette[1]}}>Dequeue</button>
        </div>
    </>
  );
}

export default Queue