import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSQLDatabase } from "expo-sqlite";
import { ICarteiraProps } from "../../repository/model/carteira/Carteira.meta";
import { IFaucetCarteiraProps } from "../../repository/model/faucet/Faucet.meta";
import FaucetService from "../../service/FaucetService";
import { IInitialStateFaucet } from "../slices/FaucetSlice";

export const buscarFaucetsCarteiraThunk = createAsyncThunk(
  'faucet/buscarFaucetsCarteira',
  async (db: WebSQLDatabase): Promise<Array<IFaucetCarteiraProps>> => {
    return await new FaucetService(db).buscarFaucetsCarteira();
  }
);


export const buscarFaucetsCarteiraBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateFaucet>) => {

  builder.addCase(buscarFaucetsCarteiraThunk.fulfilled, (state, action) => {
    state.faucets = action.payload;
  });
};