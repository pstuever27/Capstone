import { createSlice } from '@reduxjs/toolkit'

export const roomCodeSlice = createSlice({
  name: 'roomCode',
  initialState: {
    'roomCode' : ['', '', '', ''],
  },
  reducers: {
    setCode(state, { payload: code }){
        state.roomCode = code
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCode } = roomCodeSlice.actions

export default roomCodeSlice.reducer