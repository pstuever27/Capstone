import { createSlice } from '@reduxjs/toolkit'

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    'loading' : false,
  },
  reducers: {
    setLoading(state, { payload: code }){
        state.loading = code
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLoading } = loadingSlice.actions

export default loadingSlice.reducer