import { configureStore } from '@reduxjs/toolkit'
import roomCodeSlice from './roomCodeSlice'

export const store = configureStore({
    reducer: {
        roomCode: roomCodeSlice,
    },
});