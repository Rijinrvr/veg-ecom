import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminAuthState {
    isAuthenticated: boolean;
    username: string | null;
    token: string | null;
}

const initialState: AdminAuthState = {
    isAuthenticated: false,
    username: null,
    token: null,
};

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        initAdminFromStorage(state) {
            if (typeof window === 'undefined') return;
            const token = localStorage.getItem('vegfresh-admin-token');
            const username = localStorage.getItem('vegfresh-admin-username');
            if (token && username) {
                state.token = token;
                state.username = username;
                state.isAuthenticated = true;
            }
        },
        adminLoginSuccess(state, action: PayloadAction<{ token: string; username: string }>) {
            state.token = action.payload.token;
            state.username = action.payload.username;
            state.isAuthenticated = true;
            if (typeof window !== 'undefined') {
                localStorage.setItem('vegfresh-admin-token', action.payload.token);
                localStorage.setItem('vegfresh-admin-username', action.payload.username);
            }
        },
        adminLogout(state) {
            state.token = null;
            state.username = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('vegfresh-admin-token');
                localStorage.removeItem('vegfresh-admin-username');
            }
        },
    },
});

export const { initAdminFromStorage, adminLoginSuccess, adminLogout } = adminAuthSlice.actions;

// Selectors
export const selectAdminAuth = (state: { adminAuth: AdminAuthState }) => state.adminAuth.isAuthenticated;
export const selectAdminUsername = (state: { adminAuth: AdminAuthState }) => state.adminAuth.username;
export const selectAdminToken = (state: { adminAuth: AdminAuthState }) => state.adminAuth.token;

export default adminAuthSlice.reducer;
