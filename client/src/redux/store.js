import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Configuration for Redux Persist
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

// Create a persisted version of the user reducer directly
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Configure and export the Redux store
export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
});

export const persistor = persistStore(store);