import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSQLDatabase } from "expo-sqlite";
import { IFaucetCarteiraProps } from "../../repository/model/carteira/Carteira.meta";
import CarteiraService from "../../service/CarteiraService";
import { IInitialStateCarteira } from "../slices/CarteiraSlice";

interface IDadosCarteiraUsuariosProps {
  db: WebSQLDatabase;
  codigoUsuario: number;
}


export const buscarCarteirasThunk = createAsyncThunk(
  'carteira/buscarCarteiras',
  async ({ db, codigoUsuario }: IDadosCarteiraUsuariosProps): Promise<Array<IFaucetCarteiraProps>> => {
    return await new CarteiraService(db).buscarCarteiras(codigoUsuario);
  }
);


export const buscarCarteirasBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateCarteira>) => {

  builder.addCase(buscarCarteirasThunk.fulfilled, (state, action) => {
    state.carteiras = action.payload;
  });
};