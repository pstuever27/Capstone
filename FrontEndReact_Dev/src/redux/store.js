import { configureStore } from '@reduxjs/toolkit'
import roomCodeSlice from './roomCodeSlice'
import usernameSlice from './usernameSlice';

export const store = configureStore({
    reducer: {
        roomCode: roomCodeSlice,
        username: usernameSlice,
    },
});