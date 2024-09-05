import { configureStore } from "@reduxjs/toolkit";

import balanceSlice from "./slices/balanceSlice";
import orderSlice from "./slices/orderSlice";

const store = configureStore({
  reducer: {
    balance: balanceSlice,
    order: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
