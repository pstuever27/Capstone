/**
 * Prolouge
 * File: serverAddressSlice.js
 * Description: This slice is used for tracking the current server address that is associated with the build
 *              
 * Programmer(s): Paul Stuever
 * Date Created: 2/12/2024
 * 
 * Date Revised: 2/12/2024 - File created and slice created
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

// Need createSlice for use
import { createSlice } from '@reduxjs/toolkit'

// Create serverAddressSlice
export const serverAddressSlice = createSlice({
  name: 'serverAddress',
  initialState: {
    'serverAddress' : "", 
  },
  reducers: {
    setAddress(state, { payload: address }){
        state.serverAddress = address // use setAddress with dispatch to set address 
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAddress } = serverAddressSlice.actions

//Export slice
export default serverAddressSlice.reducer