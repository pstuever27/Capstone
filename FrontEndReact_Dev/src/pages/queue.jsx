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

// renders queue data structure
import { useQueueState } from "rooks"; 

// useState is used to perform side effects in function components. 
// Side effects interact outside of the component. 
// 
// The `useEffect` hook takes two arguments: 
//  a function that contains the side-effect logic, 
//  and an array of dependencies. 
// The function runs after every render, including the first one. 
// However, if you provide an array of dependencies, 
// the function will only run when the dependencies have changed.
import { useState, useEffect } from 'react' 

// imports grid component of material UI for queue list
import { Grid } from '@mui/material'; 

function Queue() {
  const { songQueue, dequeue } = useContext( QueueContext );

  return (
    <>
        <div id = "queueDiv"> 
          <h1>Queue</h1>
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