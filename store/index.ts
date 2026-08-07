import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import cartReducer from "@/store/slices/cart-slice";
import wishlistReducer from "@/store/slices/wishlist-slice";
import recentlyViewedReducer from "@/store/slices/recently-viewed-slice";
import checkoutReducer from "@/store/slices/checkout-slice";
import uiReducer from "@/store/slices/ui-slice";
import sessionReducer from "@/store/slices/session-slice";

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  recentlyViewed: recentlyViewedReducer,
  checkout: checkoutReducer,
  ui: uiReducer,
  session: sessionReducer,
});

const persistConfig = {
  key: "vero-root",
  storage,
  // Only state that should survive a refresh. Checkout, UI, and session are
  // deliberately excluded — checkout must never persist payment data, UI is
  // transient, and session will be driven by a real auth cookie/token once
  // the backend exists (Milestone 14) rather than by client storage.
  whitelist: ["cart", "wishlist", "recentlyViewed"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/REGISTER"],
        },
      }),
  });

export const store = makeStore();
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
