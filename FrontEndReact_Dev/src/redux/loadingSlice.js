import { createSlice } from '@reduxjs/toolkit'

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    'loading' : false,
  },
  reducers: {
    setCode(state, { payload: code }){
        state.loading = code
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCode } = roomCodeSlice.actions

export default roomCodeSlice.reducer