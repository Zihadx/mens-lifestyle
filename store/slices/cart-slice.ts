import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, AppliedCoupon } from "@/types/cart";

interface CartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  isDrawerOpen: boolean;
}

const initialState: CartState = {
  items: [],
  coupon: null,
  isDrawerOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((item) => item.lineId === action.payload.lineId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + action.payload.quantity, existing.maxQuantity);
      } else {
        state.items.push(action.payload);
      }
      state.isDrawerOpen = true;
    },
    removeItem: (state, action: PayloadAction<{ lineId: string }>) => {
      state.items = state.items.filter((item) => item.lineId !== action.payload.lineId);
    },
    updateQuantity: (state, action: PayloadAction<{ lineId: string; quantity: number }>) => {
      const item = state.items.find((i) => i.lineId === action.payload.lineId);
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.maxQuantity));
      }
    },
    applyCoupon: (state, action: PayloadAction<AppliedCoupon>) => {
      state.coupon = action.payload;
    },
    removeCoupon: (state) => {
      state.coupon = null;
    },
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
    },
  },
});

export const { addItem, removeItem, updateQuantity, applyCoupon, removeCoupon, openDrawer, closeDrawer, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

// Selectors (colocated so components never reach into raw state shape)
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCoupon = (state: { cart: CartState }) => state.cart.coupon;
export const selectIsCartDrawerOpen = (state: { cart: CartState }) => state.cart.isDrawerOpen;
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
