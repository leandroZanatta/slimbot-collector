import { configureStore } from "@reduxjs/toolkit";
import DbSlice from "./slices/DbSlice";
import UsuarioSlice from "./slices/UsuarioSlice";
import MigrationSlice from "./slices/MigrationSlice";
import CarteiraSlice from "./slices/CarteiraSlice";
import FaucetSlice from "./slices/FaucetSlice";
import CotacaoAtivoSlice from "./slices/CotacaoAtivoSlice";
import LoadingMessageSlice from "./slices/LoadingMessageSlice";
import ConfiguracaoSlice from "./slices/ConfiguracaoSlice";

const store = configureStore({
  reducer: {
    DbSlice,
    ConfiguracaoSlice,
    UsuarioSlice,
    MigrationSlice,
    CarteiraSlice,
    FaucetSlice,
    CotacaoAtivoSlice,
    LoadingMessageSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
