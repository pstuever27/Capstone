//--------------------------------
// File: queue.jsx (derived from App.jsx)
// Description: This react component provides queue logic. 
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

// imports queue context
import QueueContext from './queueContext'; 

// imports useContext hook from react
import { useContext } from 'react'; 

import authorizationApi from '../authorizationApi';

function Queue() {
  const { songQueue, dequeue } = useContext( QueueContext );
  const { addToQueue } = authorizationApi();

  return (
    <>
        <div id = "queueDiv"> 
          {/* <h1>Queue</h1> */}
          <div id = "queueGrid">       
            {/* maps through the songQueue array and renders each song in the queue as a grid row */}
            { songQueue?.map( ( song ) => { 
              // return a grid column for the queue render; renders artist name and title
              return <div id = "queueGridCol" span={ 12 } key={ song.name } >{ song }</div>
            } ) } 
          </div>
          <button onClick = { dequeue }>Dequeue</button>
        </div>
    </>
  );
}

export default Queue