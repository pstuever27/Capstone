import { configureStore } from '@reduxjs/toolkit'
import roomCodeSlice from './roomCodeSlice'
import usernameSlice from './usernameSlice';
import loadingSlice from './loadingSlice';

export const store = configureStore({
    reducer: {
        roomCode: roomCodeSlice,
        username: usernameSlice,
        loading: loadingSlice,
    },
});