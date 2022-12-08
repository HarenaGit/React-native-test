import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: "",
    roleName: "",
    isAuthenticated: false,
    id: 0
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action) => {
            if (action.payload?.token !== "" && action.payload?.token !== null && action.payload?.token !== undefined
                && action.payload?.roleName !== "" && action.payload?.roleName !== null && action.payload?.roleName !== undefined) {
                state.token = action.payload?.token;
                state.roleName = action.payload?.roleName;
                state.isAuthenticated = true;
                state.id = action.payload?.id;
            }
        },

        resetAuth: (state, action) => {
            state.token = "";
            state.roleName = "";
            state.isAuthenticated = false;
            id = 0;
        }
    }
})

export const { setAuth, resetAuth } = authSlice.actions;

export default authSlice.reducer;

