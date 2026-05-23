import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: { email: "", name: "", role: "", avatar: "" }
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.user = action.payload.user;
        },
        logoutAction: (state) => {
            state.isAuthenticated = false;
            state.user = { email: "", name: "", role: "", avatar: "" };
        }
    }
});

export const { setAuthData, logoutAction } = authSlice.actions;
export default authSlice.reducer;