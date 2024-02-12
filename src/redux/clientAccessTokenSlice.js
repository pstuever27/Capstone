// Need createSlice for use
import { createSlice } from '@reduxjs/toolkit'

// Create clientAccessTokenSlice
export const clientAccessTokenSlice = createSlice({
  name: 'clientAccessToken',
  initialState: {
    'clientAccessToken' : "", 
  },
  reducers: {
    setToken(state, { payload: token }){
        state.clientAccessToken = token // use setToken with dispatch to set roomCode (must be array)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setToken } = clientAccessTokenSlice.actions

//Export slice
export default clientAccessTokenSlice.reducer