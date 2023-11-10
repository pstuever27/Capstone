import { createSlice } from '@reduxjs/toolkit'

export const usernameSlice = createSlice({
  name: 'username',
  initialState: {
    'username' : "",
  },
  reducers: {
    setName(state, { payload: name }){
        state.username = name
    },
  },
})

// Action creators are generated for each case reducer function
export const { setName } = usernameSlice.actions

export default usernameSlice.reducer