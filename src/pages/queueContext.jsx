//--------------------------------
// File: queueContext.jsx 
// Description: This react component provides The queue. 
// Programmer(s): Nicholas Nguyen
// Created on: 01/19/2024
//
// Revised on: 03/02/2024
// Revision: Chinh added fallBackTracks as a list state to the context and added setFallbackTracks and clearFallbackTracks for working with array
// Revised on: 03/09/2024
// Revision: Chinh added blocklist as a list state to the context and added addBlocklist function for adding to blocklist
// Revised on: 03/18/2024
// Revision: Chinh added setQueue function, where it replaces the queue with another array (for shuffling purpose)
// Revised on: 4/1/2024
// Revision: Chinh added moveRandomToFront(), where a random element is added to the front of the list
// Revised on: 4/15/2024 
// Revision: Chinh added toggleShuffle() and toggleFallback(), two boolean values that will determine how queue functions
//
// Preconditions: Must have npm and node installed to run in dev environment. 
// Postconditions: Handles queue data structure
// 
// Error conditions: None
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------

import { createContext } from 'react';

// function QueueContext () {
//   const QueueContext = createContext( null );
//   return (
//     <>
//     </>
//   );
// }

// creates a new context object so other components can use the queue data structure.
const QueueContext = createContext( {
  songQueue: [],
  fallbackTracks: [],
  blocklist: [],
  enqueue: () => {},
  dequeue: () => {},
  setQueue: () => { },
  clearQueue: () => { },
  moveRandomToFront: () => {},
  setFallbackTracks: () => {},
  clearFallbackTracks: () => {},
  addBlocklist: () => {},
  clearBlocklist: () => {},
  toggleShuffle: () => {},
  toggleFallback: () => {},
} );

export default QueueContext;