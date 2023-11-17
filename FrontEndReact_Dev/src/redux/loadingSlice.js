/**
 * Prolouge
 * File: loadingSlice.js
 * Description: This slice will be used to track if an element or page is loading and we need to wait for that to finish first. 
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

import { createSlice } from '@reduxjs/toolkit'

// Create the slice 
export const loadingSlice = createSlice({
  name: 'loading', // Can use 'loading' as name
  initialState: {
    'loading' : false, // initially set to false
  },
  reducers: {
    setLoading(state, { payload: code }){
        state.loading = code //When we want to change the value, just call setLoading using dispatch
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLoading } = loadingSlice.actions

// Export the slice
export default loadingSlice.reducer