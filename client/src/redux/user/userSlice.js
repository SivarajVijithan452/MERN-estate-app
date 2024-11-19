import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the user slice
// currentUser: stores the user data when logged in
// error: stores any error messages during authentication
// loading: indicates if an authentication process is ongoing
const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

export const userSlice = createSlice({
    name: 'user', // Unique name for this slice of the Redux store
    initialState,
    reducers: {
        // Called when sign-in process starts
        // Sets loading to true to show loading indicators
        signInStart: (state) => {
            state.loading = true;
        },
        
        // Called when sign-in is successful
        // Updates the currentUser with the payload (user data)
        // Clears any previous errors and sets loading to false
        signInSuccess: (state, action) => {
            // console.log("User data:", action.payload);
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        
        // Called when sign-in fails
        // Stores the error message in state and sets loading to false
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        updateUserStart: (state) => {
            state.loading = true;
        },
        
        // Add this new reducer for updating user
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
        },

        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        // Called when delete user process starts
        deleteUserAccocuntStart: (state) => {
            state.loading = true;
        },

        // Called when delete user is successful
        deleteUserAccocuntSuccess: (state) => {
            state.currentUser = null; // Optionally clear currentUser on successful deletion
            state.loading = false;
            state.error = null;
        },

        // Called when delete user fails
        deleteUserAccocuntFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
})

// Export the action creators for use in components
export const { signInStart, signInSuccess, signInFailure, updateUserStart, updateUserSuccess, updateUserFailure, deleteUserAccocuntStart, deleteUserAccocuntSuccess, deleteUserAccocuntFailure } = userSlice.actions;

// Export the reducer for store configuration
export default userSlice.reducer;
