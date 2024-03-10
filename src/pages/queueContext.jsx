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
  setFallbackTracks: () => {},
  clearFallbackTracks: () => {},
  addBlocklist: () => {},
} );

export default QueueContext;