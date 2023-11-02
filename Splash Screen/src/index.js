/**
 * Prolouge
 * File: index.js
 * Description: js entry point for react app
 *              
 * Programmer's Name: Nicholas Nguyen
 * Date Created: 11/1/2023
 * Date Revised: 11/1/2023 - Nicholas Nguyen - Began Splashscreen UI Integration
 *  Revision: 11/1/2023 - Nicholas Nguyen - Began Splashscreen UI Integration
 * Preconditions: 
 *  @inputs : None
 * Postconditions:
 *  @returns : 
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: 
 * **/

import React from 'react';

// use ReactDOM to render app component into root <div>
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';

ReactDOM.render(<App />, document.getElementById( "root" ) );