// Import required dependencies from Redux Toolkit and Redux Persist
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage for web

// Combine multiple reducers into a single root reducer
const rootReducer = combineReducers({
    user: userReducer,
});

// Configuration for Redux Persist
// This defines how and what to persist in storage
const persistConfig = {
    key: 'root', // Key under which state will be stored
    storage, // Storage engine to use (localStorage)
    version: 1, // Version number for possible future migrations
};

// Create a persisted version of our root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure and export the Redux store
export const store = configureStore({
    reducer: {
        // Use the persisted reducer to enable state persistence
        user: persistedReducer,
    },
    // Configure middleware
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        // Disable serializable check since Redux Persist uses non-serializable values
        serializableCheck: false,
    })
});

// Create a persistor object to be used for persisting and rehydrating state
export const persistor = persistStore(store);