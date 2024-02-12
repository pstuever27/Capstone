/**
 * Prolouge
 * File: roomCodeSlice.js
 * Description: This slice is used for tracking the current roomCode that is associated with the user
 *              
 * Programmer(s): Paul Stuever
 * Date Created: 11/17/2023
 * 
 * Date Revised: 11/17/2023 - File created and slice created
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

// Create roomCodeSlice
export const roomCodeSlice = createSlice({
  name: 'roomCode',
  initialState: {
    'roomCode' : ['', '', '', ''], // Due to the way our input is on the splash screen, we're using an array here. Empty to begin
  },
  reducers: {
    setCode(state, { payload: code }){
        state.roomCode = code // use setCode with dispatch to set roomCode (must be array)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCode } = roomCodeSlice.actions

//Export slice
export default roomCodeSlice.reducer