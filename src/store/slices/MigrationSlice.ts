import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Carteira from '../../repository/model/carteira/Carteira';
import Configuracao from '../../repository/model/configuracao/Configuracao';
import ExecucaoFaucet from '../../repository/model/execucaofaucet/EcecucaoFaucet';
import Faucet from '../../repository/model/faucet/Faucet';
import { IMigrationQueryProps } from '../../repository/types/RepositoryTypes';
import { migrateBuilderAsync } from '../thunk/MigrationThunk';

export interface IInitialStateMigration {
  status: number;
  migrations: Array<IMigrationQueryProps>
}

const initialState: IInitialStateMigration = {
  status: 0,
  migrations: [
    {
      name: "202301180056",
      query: Configuracao.Builder().getDDL(),
    },
    {
      name: "202301181259",
      query: Carteira.Builder().getDDL(),
    },
    {
      name: "202301181345",
      query: ["insert into tb_carteira(id_carteira,tx_descricao,cd_tipo,fl_ativo,vl_saldoresgate,fl_registrado, tx_host, tx_refer) values (1,'ADA', 0, false, 5, false, 'freecardano.com', 'https://freecardano.com/?ref=467018'),(2, 'BFG', 0, false, 100, false, 'freebfg.com', 'https://freebfg.com/?ref=4876'),(3, 'BNB', 0, false, 0.03, false, 'freebinancecoin.com', 'https://freebinancecoin.com/?ref=363498'),(4, 'BTC', 0, false, 0.0002, false, 'freebitcoin.io', 'https://freebitcoin.io/?ref=718462'),(6, 'BTT', 0, false, 2000000, false, 'freebittorrent.com', 'https://freebittorrent.com/?ref=11138'),(7, 'CAKE', 0, false, 0.3, false, 'freepancake.com', 'https://freepancake.com/?ref=36227'),(8, 'DASH', 0, false, 0.1, false, 'freedash.io', 'https://freedash.io/?ref=216098'),(9, 'DOGE', 0, false, 30, false, 'free-doge.com', 'https://free-doge.com/?ref=282676'),(10, 'ETH', 0, false, 0.002, false, 'freeethereum.com', 'https://freeethereum.com/?ref=377836'),(11, 'MATIC', 0, false, 1, false, 'freematic.com', 'https://freematic.com/?ref=51655'),(12, 'NEO', 0, false, 1, false, 'freeneo.io', 'https://freeneo.io/?ref=158431'),(13, 'SHIB', 0, false, 50000, false, 'freeshibainu.com', 'https://freeshibainu.com/?ref=147037'),(14, 'Steam', 0, false, 5, false, 'freesteam.io', 'https://freesteam.io/?ref=172023'),(15, 'TRX', 0, false, 40, false, 'free-tron.com', 'https://free-tron.com/?ref=453611'),(16, 'USDC', 0, false, 5, false, 'freeusdcoin.com', 'https://freeusdcoin.com/?ref=208724'),(17, 'USDT', 0, false, 5, false, 'freetether.com', 'https://freetether.com/?ref=298043'),(18, 'XEM', 0, false, 10, false, 'freenem.com', 'https://freenem.com/?ref=350870'),(19, 'XRP', 0, false, 5, false, 'coinfaucet.io', 'https://coinfaucet.io/?ref=934177'),(20, 'LTC', 0, false, 0.1, false, 'free-ltc.com', 'https://free-ltc.com/?ref=237016')"],
    },
    {
      name: "202301181631",
      query: Faucet.Builder().getDDL(),
    },
    {
      name: "202301271741",
      query: ExecucaoFaucet.Builder().getDDL(),
    },
  ]
};

const slice = createSlice({
  name: 'migrations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    migrateBuilderAsync(builder);
  },
});

export default slice.reducer;
