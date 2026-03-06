import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import adminAuthReducer from './slices/adminAuthSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        user: userReducer,
        adminAuth: adminAuthReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
