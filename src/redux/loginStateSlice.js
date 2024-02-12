/**
 * Prolouge
 * File: loginStateSlice.js
 * Description: This slice will be used to track if our current user (host) is logged into Spotify. If not, it will be set to false
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

// Need createSlice to begin
import { createSlice } from '@reduxjs/toolkit'

// Create loginStateSlice 
export const loginStateSlice = createSlice({
  name: 'loginState',
  initialState: {
    'loginState' : true, // Set to true for now, but will need to be false later when Spotify is integrated
  },
  reducers: {
    setLoginState(state, { payload: code }){
        state.loginState = code // Using setLoginState with dispatch to change value
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLoginState } = loginStateSlice.actions

// Export slice
export default loginStateSlice.reducer