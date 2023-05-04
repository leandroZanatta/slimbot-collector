import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Carteira from '../../repository/model/carteira/Carteira';
import Configuracao from '../../repository/model/configuracao/Configuracao';
import ExecucaoFaucet from '../../repository/model/execucaofaucet/EcecucaoFaucet';
import Faucet from '../../repository/model/faucet/Faucet';
import { IMigrationQueryProps } from '../../repository/types/RepositoryTypes';
import { migrateBuilderAsync } from '../thunk/MigrationThunk';
import Usuario from '../../repository/model/usuario/Usuario';

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
      name: "202301180058",
      query: Usuario.Builder().getDDL(),
    },
    {
      name: "202301181259",
      query: Carteira.Builder().getDDL(),
    },
    {
      name: "202301181631",
      query: Faucet.Builder().getDDL(),
    },
    {
      name: "202301271741",
      query: ExecucaoFaucet.Builder().getDDL(),
    },
    {
      name: "202301181345",
      query: ["insert into tb_carteira(id_carteira, tx_descricao, tx_uuid, cd_tipo, vl_saldoresgate, tx_host, tx_refer) values (1,'ADA', 'cardano', 0, 5, 'freecardano.com', 'https://freecardano.com/?ref=467018'),(2, 'BFG', 'bfg-token', 0, 100, 'freebfg.com', 'https://freebfg.com/?ref=4876'),(3, 'BNB', 'binancecoin', 0, 0.03, 'freebinancecoin.com', 'https://freebinancecoin.com/?ref=363498'),(4, 'BTC', 'bitcoin', 0, 0.0002, 'freebitcoin.io', 'https://freebitcoin.io/?ref=718462'),(6, 'BTT', 'bittorrent', 0, 2000000, 'freebittorrent.com', 'https://freebittorrent.com/?ref=11138'),(7, 'CAKE', 'pancakeswap-token', 0, 0.3, 'freepancake.com', 'https://freepancake.com/?ref=36227'),(8, 'DASH', 'dash', 0, 0.1, 'freedash.io', 'https://freedash.io/?ref=216098'),(9, 'DOGE', 'dogecoin', 0, 30, 'free-doge.com', 'https://free-doge.com/?ref=282676'),(10, 'ETH', 'ethereum', 0, 0.002, 'freeethereum.com', 'https://freeethereum.com/?ref=377836'),(11, 'MATIC', 'matic-network', 0, 1, 'freematic.com', 'https://freematic.com/?ref=51655'),(12, 'NEO', 'neo', 0, 1, 'freeneo.io', 'https://freeneo.io/?ref=158431'),(13, 'SHIB', 'shiba-inu', 0, 250000, 'freeshibainu.com', 'https://freeshibainu.com/?ref=147037'),(14, 'Steam', 'usd', 0, 5, 'freesteam.io', 'https://freesteam.io/?ref=172023'),(15, 'TRX', 'tron', 0, 40, 'free-tron.com', 'https://free-tron.com/?ref=453611'),(16, 'USDC', 'usd-coin', 0, 5, 'freeusdcoin.com', 'https://freeusdcoin.com/?ref=208724'),(17, 'USDT', 'tether', 0, 5, 'freetether.com', 'https://freetether.com/?ref=298043'),(18, 'XEM', 'nem', 0, 10, 'freenem.com', 'https://freenem.com/?ref=350870'),(19, 'XRP', 'ripple', 0, 5, 'coinfaucet.io', 'https://coinfaucet.io/?ref=934177'),(20, 'LTC', 'litecoin', 0, 0.1, 'free-ltc.com', 'https://free-ltc.com/?ref=237016')"],
    },
    {
      name: "202301181346",
      query: ["insert into tb_configuracao(id_configuracao, tx_captchahost) values (1,'http://3.84.233.146')"],
    }
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
