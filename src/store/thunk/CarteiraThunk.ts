import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSQLDatabase } from "expo-sqlite";
import { ICarteiraProps } from "../../repository/model/carteira/Carteira.meta";
import CarteiraService from "../../service/CarteiraService";
import { IInitialStateCarteira } from "../slices/CarteiraSlice";

export const buscarCarteirasThunk = createAsyncThunk(
  'carteira/buscarCarteiras',
  async (db: WebSQLDatabase): Promise<Array<ICarteiraProps>> => {
    return await new CarteiraService(db).buscarCarteiras();
  }
);


export const buscarCarteirasBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateCarteira>) => {

  builder.addCase(buscarCarteirasThunk.fulfilled, (state, action) => {
    state.carteiras = action.payload;
  });
};