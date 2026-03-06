import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '@/types';

interface CartState {
    items: CartItem[];
}

// Load cart from localStorage (client-side only)
const loadCartFromStorage = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem('vegfresh-cart');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const saveCartToStorage = (items: CartItem[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('vegfresh-cart', JSON.stringify(items));
    }
};

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        initCartFromStorage(state) {
            state.items = loadCartFromStorage();
        },
        addToCart(state, action: PayloadAction<Product>) {
            const existing = state.items.find(item => item.product.id === action.payload.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ product: action.payload, quantity: 1 });
            }
            saveCartToStorage(state.items);
        },
        removeFromCart(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item.product.id !== action.payload);
            saveCartToStorage(state.items);
        },
        updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
            const item = state.items.find(item => item.product.id === action.payload.productId);
            if (item) {
                if (action.payload.quantity <= 0) {
                    state.items = state.items.filter(i => i.product.id !== action.payload.productId);
                } else {
                    item.quantity = action.payload.quantity;
                }
            }
            saveCartToStorage(state.items);
        },
        clearCart(state) {
            state.items = [];
            saveCartToStorage(state.items);
        },
    },
});

export const { initCartFromStorage, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectItemCount = (state: { cart: CartState }) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectSubtotal = (state: { cart: CartState }) =>
    state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
export const selectDeliveryFee = (state: { cart: CartState }) => {
    const subtotal = state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    return subtotal >= 500 ? 0 : 40;
};
export const selectTotal = (state: { cart: CartState }) => {
    const subtotal = state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    return subtotal + (subtotal >= 500 ? 0 : 40);
};

export default cartSlice.reducer;
