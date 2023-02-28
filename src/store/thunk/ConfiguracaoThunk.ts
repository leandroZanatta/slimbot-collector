import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSQLDatabase } from "expo-sqlite";
import { IConfiguracaoFormProps } from "../../presentation/configuracao/ConfiguracaoBasica";
import CarteiraRepository from "../../repository/CarteiraRepository";
import ConfiguracaoRepository from "../../repository/ConfiguracaoRepository";
import FaucetRepository from "../../repository/FaucetRepository";
import Carteira from "../../repository/model/carteira/Carteira";
import { ICarteiraProps } from "../../repository/model/carteira/Carteira.meta";
import Configuracao from "../../repository/model/configuracao/Configuracao";
import { IConfiguracaoProps } from "../../repository/model/configuracao/Configuracao.meta";
import Faucet from "../../repository/model/faucet/Faucet";
import ConfiguracaoService from "../../service/ConfiguracaoService";
import { IInitialStateConfiguracao } from "../slices/ConfiguracaoSlice";

interface SalvarConfiguracaoProps {
  db: WebSQLDatabase;
  configuracao: IConfiguracaoFormProps;
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
    debugger
    const data: IConfiguracaoProps = await new ConfiguracaoService(props.db).salvarConfiguracao(props.configuracao as IConfiguracaoProps);

    if (props.configuracao.usuarioRegistrado) {

      const carteiraRepository: CarteiraRepository = new CarteiraRepository(props.db);
      const faucetRepository: FaucetRepository = new FaucetRepository(props.db);

      const carteiras: Array<ICarteiraProps> = await carteiraRepository.list(Carteira.Builder());

      carteiras.forEach(carteira => {

        carteiraRepository.atualizarSituacaoCarteira(carteira.id, true, 3);

        faucetRepository.save(Faucet.Builder().codigoCarteira(carteira.id).codigoUsuario(data.id).proximaExecucao(new Date()).saldoAtual(0));
      });


    }
    return data;
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

