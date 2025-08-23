// redux/Store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/Cartslice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // avoid warnings for non-serializable values
    }),
  devTools: import.meta.env.MODE !== "production", // enable Redux DevTools in dev
});

// Types for Redux hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
