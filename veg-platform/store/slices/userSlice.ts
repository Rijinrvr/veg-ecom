import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface UserState {
    user: UserData | null;
    token: string | null;
    isLoggedIn: boolean;
    loading: boolean;
    error: string | null;
    redirectAfterLogin: string | null;
}

const initialState: UserState = {
    user: null,
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    redirectAfterLogin: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
    'user/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/auth/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) return rejectWithValue(data.error || 'Login failed');
            return data;
        } catch {
            return rejectWithValue('Network error. Please try again.');
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (
        { name, email, phone, password }: { name: string; email: string; phone: string; password: string },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password }),
            });
            const data = await res.json();
            if (!res.ok) return rejectWithValue(data.error || 'Registration failed');

            // Auto-login after registration
            const loginResult = await dispatch(loginUser({ email, password })).unwrap();
            return loginResult;
        } catch {
            return rejectWithValue('Network error. Please try again.');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        initUserFromStorage(state) {
            if (typeof window === 'undefined') return;
            try {
                const token = localStorage.getItem('vegfresh-user-token');
                const userData = localStorage.getItem('vegfresh-user-data');
                if (token && userData) {
                    state.token = token;
                    state.user = JSON.parse(userData);
                    state.isLoggedIn = true;
                }
            } catch {
                // ignore
            }
        },
        logoutUser(state) {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            state.error = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('vegfresh-user-token');
                localStorage.removeItem('vegfresh-user-data');
            }
        },
        clearUserError(state) {
            state.error = null;
        },
        setRedirectAfterLogin(state, action: PayloadAction<string | null>) {
            state.redirectAfterLogin = action.payload;
        },
        clearRedirectAfterLogin(state) {
            state.redirectAfterLogin = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.error = null;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('vegfresh-user-token', action.payload.token);
                    localStorage.setItem('vegfresh-user-data', JSON.stringify(action.payload.user));
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    initUserFromStorage,
    logoutUser,
    clearUserError,
    setRedirectAfterLogin,
    clearRedirectAfterLogin,
} = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsLoggedIn = (state: { user: UserState }) => state.user.isLoggedIn;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserToken = (state: { user: UserState }) => state.user.token;
export const selectRedirectAfterLogin = (state: { user: UserState }) => state.user.redirectAfterLogin;

export default userSlice.reducer;
