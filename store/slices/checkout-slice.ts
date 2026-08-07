import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CheckoutAddress, CheckoutState, PaymentMethod } from "@/types/cart";

const initialState: CheckoutState = {
  address: {},
  paymentMethod: "cod",
  orderNotes: "",
  step: "address",
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    updateAddress: (state, action: PayloadAction<Partial<CheckoutAddress>>) => {
      state.address = { ...state.address, ...action.payload };
    },
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = action.payload;
    },
    setOrderNotes: (state, action: PayloadAction<string>) => {
      state.orderNotes = action.payload;
    },
    setCheckoutStep: (state, action: PayloadAction<CheckoutState["step"]>) => {
      state.step = action.payload;
    },
    resetCheckout: () => initialState,
  },
});

export const { updateAddress, setPaymentMethod, setOrderNotes, setCheckoutStep, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;

export const selectCheckout = (state: { checkout: CheckoutState }) => state.checkout;
