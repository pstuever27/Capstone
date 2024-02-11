//--------------------------------
// File: vite.config.js
// Description: Config file generated by vite setup command `npm create vite@latest` and then manually edited slightly. 
// Programmer(s): Kieran Delaney
// Created on: 9/21/2023
// Revised on: 9/21/2023
// Revision: Kieran added the "build" and "server" objects with their members so that the development server runs in port 3000 locally, and the build command works.
// Preconditions: Must have npm and node installed.
// Postconditions: Configures vite react compiler and server
// Error conditions: None
// Side effects: No known side effects
// Invariants: The "open" member of the server is always true so that the server will be open while the program runs
// Faults: None
//--------------------------------
import { defineConfig } from 'vite' // imports vite config dependencies
import react from '@vitejs/plugin-react' // imports react dependencies from vite
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({ // exporting configuration to the react setup
  plugins: [react()], // specifies that the vite system is dealing with react by pulling in those for plugins
  build:{ //build object that allows us to specify aspects of the build
    outDir:'build', // specifies the name of the directory that the build goes into to be "/build"
  },
  server: { // server object allows us to configure aspects of the server
    port: 3000, // specify that the server will run on port 3000 locally
    open: true, // specifies that the server will automatically open while the program is running
  },
})
