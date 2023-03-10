import { configureStore } from "@reduxjs/toolkit";
import DbSlice from "./slices/DbSlice";
import ConfiguracaoSlice from "./slices/ConfiguracaoSlice";
import MigrationSlice from "./slices/MigrationSlice";
import CarteiraSlice from "./slices/CarteiraSlice";
import FaucetSlice from "./slices/FaucetSlice";

const store = configureStore({
  reducer: {
    DbSlice,
    ConfiguracaoSlice,
    MigrationSlice,
    CarteiraSlice,
    FaucetSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
