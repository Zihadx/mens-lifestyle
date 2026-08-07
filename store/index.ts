import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Slices are added milestone-by-milestone (cart, wishlist, checkout, ui, session).
// Root reducer starts empty and grows without touching this file's structure.
const rootReducer = combineReducers({
  // cart: cartReducer,
  // wishlist: wishlistReducer,
  // checkout: checkoutReducer,
  // ui: uiReducer,
});

const persistConfig = {
  key: "vero-root",
  storage,
  whitelist: ["cart", "wishlist"], // only persist what should survive a refresh — never checkout payment data
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });

export const store = makeStore();
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
