import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSQLDatabase } from "expo-sqlite";
import CarteiraRepository from "../../repository/CarteiraRepository";
import FaucetRepository from "../../repository/FaucetRepository";
import { ICarteiraProps } from "../../repository/model/carteira/Carteira.meta";
import Faucet from "../../repository/model/faucet/Faucet";
import { IFaucetProps } from "../../repository/model/faucet/Faucet.meta";
import CotacaoAtivoService from "../../service/CotacaoAtivoService";
import { ICotacaoAtivo } from "../../types/CotacaoAtivo";
import { IInitialStateCotacaoAtivo } from "../slices/CotacaoAtivoSlice";

export const buscarCotacaoAtivos = createAsyncThunk(
  'cotacaoAtivo/buscarCotacaoAtivos',
  async (db: WebSQLDatabase): Promise<Array<ICotacaoAtivo>> => {

    const carteiras: Array<ICarteiraProps> = await new CarteiraRepository(db).buscarCarteiras();
    const faucets = await new FaucetRepository(db).list(Faucet.Builder());
    const cotacoes = await new CotacaoAtivoService().buscarCotacaoAtivos(carteiras.map(carteira => carteira.uuid).join('%2C'));
    const dadosCotacao: Array<ICotacaoAtivo> = [];


    carteiras.forEach(carteira => {

      const faucetAtual = faucets.filter(faucet => faucet.codigoCarteira === carteira.id);
      const cotacaoAtual = cotacoes[carteira.uuid];

      dadosCotacao.push({
        carteira: carteira,
        quantidade: faucetAtual.length > 0 ? faucetAtual[0].saldoAtual : 0,
        preco: cotacaoAtual ? cotacaoAtual.brl : 0
      })
    });

    return dadosCotacao;
  }
);

export const buscarCotacaoAtivoBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateCotacaoAtivo>) => {
  builder.addCase(buscarCotacaoAtivos.pending, (state) => {
    state.loading = true
  });

  builder.addCase(buscarCotacaoAtivos.fulfilled, (state, action) => {
    state.cotacoes = action.payload;
    state.loading = false
  });

  builder.addCase(buscarCotacaoAtivos.rejected, (state) => {
    state.loading = false
  });
};


