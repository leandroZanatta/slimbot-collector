import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSQLDatabase } from "expo-sqlite";
import ConfiguracaoService from "../../service/ConfiguracaoService";
import { IConfiguracaoProps } from "../../repository/model/configuracao/Configuracao.meta";
import { IInitialStateConfiguracao } from "../slices/ConfiguracaoSlice";

export const buscarConfiguracaoThunk = createAsyncThunk(
  'configuracao/buscarConfiguracao',
  async (db: WebSQLDatabase): Promise<IConfiguracaoProps | null> => {
    return await new ConfiguracaoService(db).buscarConfiguracao();
  }
);


export const buscarConfiguracaoBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateConfiguracao>) => {

  builder.addCase(buscarConfiguracaoThunk.fulfilled, (state, action) => {
    state.configuracao = action.payload;
  });
};