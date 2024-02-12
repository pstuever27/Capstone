// Need createSlice for use
import { createSlice } from '@reduxjs/toolkit'

// Create clientAccessTokenSlice
export const authorizationAccessTokenSlice = createSlice({
  name: 'authorizationAccessToken',
  initialState: {
    'authorizationAccessToken' : "", 
  },
  reducers: {
    setAccessToken(state, { payload: token }){
        state.authorizationAccessToken = token // use setToken with dispatch to set roomCode (must be array)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAccessToken } = authorizationAccessTokenSlice.actions

//Export slice
export default authorizationAccessTokenSlice.reducer