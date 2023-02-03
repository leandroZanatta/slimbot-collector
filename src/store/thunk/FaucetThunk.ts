import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSQLDatabase } from "expo-sqlite";
import { ICarteiraProps } from "../../repository/model/carteira/Carteira.meta";
import { IFaucetCarteiraProps } from "../../repository/model/faucet/Faucet.meta";
import FaucetService from "../../service/FaucetService";
import { IInitialStateFaucet } from "../slices/FaucetSlice";

interface IDadosFaucetCarteiraProps {
  db: WebSQLDatabase;
  cdFaucet: number;
}

export const buscarFaucetsCarteiraThunk = createAsyncThunk(
  'faucet/buscarFaucetsCarteira',
  async (db: WebSQLDatabase): Promise<Array<IFaucetCarteiraProps>> => {
    return await new FaucetService(db).buscarFaucetsCarteira();
  }
);

export const atualizarDadosFaucetCarteiraThunk = createAsyncThunk(
  'faucet/atualizarDadosFaucetCarteira',
  async ({ db, cdFaucet }: IDadosFaucetCarteiraProps): Promise<IFaucetCarteiraProps> => {
    return await new FaucetService(db).buscarFaucetCarteiraPorId(cdFaucet);
  }
);


export const buscarFaucetsCarteiraBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateFaucet>) => {

  builder.addCase(buscarFaucetsCarteiraThunk.fulfilled, (state, action) => {
    state.faucets = action.payload;
  });
};

export const atualizarDadosFaucetCarteiraBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateFaucet>) => {

  builder.addCase(atualizarDadosFaucetCarteiraThunk.fulfilled, (state, action) => {
    state.faucets = state.faucets.map(item => {
      if (item.id == action.payload.id) {
        return action.payload
      }
      return item;
    })
  });
};