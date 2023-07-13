import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSQLDatabase } from "expo-sqlite";
import { IFaucetCarteiraProps } from "../../repository/model/faucet/Faucet.meta";
import FaucetService from "../../service/FaucetService";
import { IInitialStateFaucet } from "../slices/FaucetSlice";

interface IDadosFaucetCarteiraProps {
  db: WebSQLDatabase;
  cdFaucet: number;
}

interface IDadosFaucetUsuarioProps {
  db: WebSQLDatabase;
  cdUsuario: number;
}

export const buscarFaucetsCarteiraThunk = createAsyncThunk(
  "faucet/buscarFaucetsCarteira",
  async ({
    db,
    cdUsuario,
  }: IDadosFaucetUsuarioProps): Promise<Array<IFaucetCarteiraProps>> => {
    return await new FaucetService(db).buscarFaucetsCarteira(cdUsuario);
  }
);

export const atualizarDadosFaucetCarteiraThunk = createAsyncThunk(
  "faucet/atualizarDadosFaucetCarteira",
  async ({
    db,
    cdFaucet,
  }: IDadosFaucetCarteiraProps): Promise<IFaucetCarteiraProps> => {
    return await new FaucetService(db).buscarFaucetCarteiraPorId(cdFaucet);
  }
);

export const buscarFaucetsCarteiraBuilderAsync = (
  builder: ActionReducerMapBuilder<IInitialStateFaucet>
) => {
  builder.addCase(buscarFaucetsCarteiraThunk.fulfilled, (state, action) => {
    state.faucets = action.payload;
  });
};

export const atualizarDadosFaucetCarteiraBuilderAsync = (
  builder: ActionReducerMapBuilder<IInitialStateFaucet>
) => {
  builder.addCase(
    atualizarDadosFaucetCarteiraThunk.fulfilled,
    (state, action) => {
      state.faucets = state.faucets.map((item) => {
        if (item.id == action.payload.id) {
          return action.payload;
        }
        return item;
      });

      state.faucets.sort(
        (p1, p2) =>
          new Date(p1.proximaExecucao).getTime() -
          new Date(p2.proximaExecucao).getTime()
      );
    }
  );
};
