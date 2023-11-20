/**
 * Prolouge
 * File: usernameSlice.js
 * Description: This slice is used to track the username or room name that has been chosen for the user. 
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

// Need createSlice for this
import { createSlice } from '@reduxjs/toolkit'

// Create usernameSlice
export const usernameSlice = createSlice({
  name: 'username',
  initialState: {
    'username' : "", // Initial value is empty
  },
  reducers: {
    setName(state, { payload: name }){
        state.username = name // use setName with dispatch to set value
    },
  },
})

// Action creators are generated for each case reducer function
export const { setName } = usernameSlice.actions
 
// Export component
export default usernameSlice.reducer