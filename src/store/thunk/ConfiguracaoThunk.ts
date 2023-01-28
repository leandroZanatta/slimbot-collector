import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSQLDatabase } from "expo-sqlite";
import ConfiguracaoRepository from "../../repository/ConfiguracaoRepository";
import Configuracao from "../../repository/model/configuracao/Configuracao";
import { IConfiguracaoProps } from "../../repository/model/configuracao/Configuracao.meta";
import ConfiguracaoService from "../../service/ConfiguracaoService";
import { IInitialStateConfiguracao } from "../slices/ConfiguracaoSlice";

interface SalvarConfiguracaoProps {
  db: WebSQLDatabase;
  configuracao: IConfiguracaoProps;
}

export const buscarConfiguracaoThunk = createAsyncThunk(
  'configuracao/buscarConfiguracao',
  async (db: WebSQLDatabase): Promise<IConfiguracaoProps | null> => {
    return await new ConfiguracaoRepository(db).findFirst(Configuracao.Builder().id(1));
  }
);

export const salvarConfiguracaoThunk = createAsyncThunk(
  'configuracao/salvarConfiguracao',
  async (props: SalvarConfiguracaoProps): Promise<IConfiguracaoProps | null> => {
    return await new ConfiguracaoService(props.db).salvarConfiguracao(props.configuracao);
  }
);

export const buscarConfiguracaoBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateConfiguracao>) => {
  builder.addCase(buscarConfiguracaoThunk.pending, (state) => {
    state.loading = true
  });

  builder.addCase(buscarConfiguracaoThunk.fulfilled, (state, action) => {
    state.configuracao = action.payload;
    state.loading = false
  });

  builder.addCase(buscarConfiguracaoThunk.rejected, (state) => {
    state.loading = false
  });
};

export const salvarConfiguracaoBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateConfiguracao>) => {
  builder.addCase(salvarConfiguracaoThunk.pending, (state) => {
    state.loading = true
  });

  builder.addCase(salvarConfiguracaoThunk.fulfilled, (state, action) => {
    state.configuracao = action.payload;
    state.loading = false
  });

  builder.addCase(salvarConfiguracaoThunk.rejected, (state) => {
    state.loading = false
  });
};

