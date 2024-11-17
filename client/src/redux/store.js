import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';

// Configure and export the Redux store
export const store = configureStore({
    reducer: {
        // Directly assign userReducer to the 'user' key
        user: userReducer,
    },
    // Disable serializable check to allow non-serializable values in actions/state
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
});
