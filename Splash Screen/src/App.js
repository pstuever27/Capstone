/**
 * Prolouge
 * File: App.js
 * Description: contains App cponent. top-level component for the 
 *              react app, wrapping/rendering SplashScreen
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
 * Known Faults: must integrate PHP backend
 * **/

import React from 'react';
import Splash from './Splash'; 

function App() 
{
    return (
        <div className="app-container">
            <Splash />
        </div>
    );
}

export default App;