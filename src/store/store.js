// store.js
import { configureStore } from "@reduxjs/toolkit";
import { gaswalaApi } from "./services";
import { cartApi } from "./cartApi";

export const store = configureStore({
  reducer: {
    [gaswalaApi.reducerPath]: gaswalaApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(gaswalaApi.middleware)
      .concat(cartApi.middleware),
});
