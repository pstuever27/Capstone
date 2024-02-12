/**
 * Prolouge
 * File: store.js
 * Description: This file is used for the reduxjs toolkit, which allows for project-wide globals to be used between files. 
 *              store.js acts as an interface for components to access these globals, or, 'slices'.
 *              
 * Programmer(s): Paul Stuever
 * Date Created: 11/17/2023
 * 
 * Date Revised: 11/17/2023 - File created and slices introduced
 * 
 * Preconditions: 
 *  @inputs : None 
 * Postconditions:
 *  @returns : 
 * Error conditions: None
 * Side effects: None
 * Invariants: None
 * Known Faults: 
 * **/


//Necessary imports from other slices and reduxjs toolkit
import { configureStore } from '@reduxjs/toolkit'
import roomCodeSlice from './roomCodeSlice'
import usernameSlice from './usernameSlice';
import loadingSlice from './loadingSlice';
import loginStateSlice from './loginStateSlice';
import clientAccessTokenSlice from './clientAccessTokenSlice';
import serverAddressSlice from './serverAddressSlice';

// Create the store using the other slices
export const store = configureStore({
    reducer: {
        roomCode: roomCodeSlice,
        username: usernameSlice,
        loading: loadingSlice,
        loginState: loginStateSlice,
        clientAccessToken: clientAccessTokenSlice,
        serverAddress: serverAddressSlice,
    },
});