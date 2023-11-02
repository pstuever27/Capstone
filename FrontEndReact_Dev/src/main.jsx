//--------------------------------
// File: Main.jsx
// Description: This is the react component that does the explicit rendering of the site
// Programmer(s): Kieran Delaney
// Created on: 9/21/2023
// Revised on: 11/02/2023
// Revision: Kieran wrapped the react app root in the MantineProvider element to fix a bug with Mantine not rendering
// Preconditions: Must have npm and node installed to run in dev environment. Also see SpotifyAPI.js for its preconditions.
// Postconditions: Renders entire react app to the DOM.
// Error conditions: None
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------
import React from 'react' //imports react dependencies
import ReactDOM from 'react-dom/client' //imports reactDOM for rendering webpage
import App from './App.jsx' //imports App function from App.jsx to specify what is being rendered
import './index.css' //imports styling specifications
import { MantineProvider } from '@mantine/core';

ReactDOM.createRoot(document.getElementById('root')).render( //creates a react root for the root DOM element and uses the render method to display the react app inside the root
  <React.StrictMode> {/* strict mode for more checks and warnings while in dev mode */}
  <MantineProvider> {/* necessary for mantine to work, and can be used to apply themes over the entire app using the theme attribute */}
    <App /> {/* inserts our react app contents into the react DOM root to be rendered on webpage */}
  </MantineProvider>
  </React.StrictMode>,
)
