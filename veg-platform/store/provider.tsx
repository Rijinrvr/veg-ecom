'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { initCartFromStorage } from './slices/cartSlice';
import { initUserFromStorage } from './slices/userSlice';
import { initAdminFromStorage } from './slices/adminAuthSlice';

function StoreInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = store.dispatch;

    useEffect(() => {
        dispatch(initCartFromStorage());
        dispatch(initUserFromStorage());
        dispatch(initAdminFromStorage());
    }, [dispatch]);

    return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <StoreInitializer>{children}</StoreInitializer>
        </Provider>
    );
}
