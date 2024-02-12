//--------------------------------
// File: paletteContext.jsx 
// Description: This react component provides palette for accessing dominant colors throughout components. 
// Programmer(s): Nicholas Nguyen
// Created on: 02/09/2024
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

// creates a new context object so other components can use the queue data structure.
const PaletteContext = createContext( {
  palette: [],
  update: () => {},
} );

export default PaletteContext;