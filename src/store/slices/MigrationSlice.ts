import { createSlice } from "@reduxjs/toolkit";
import { IMigrationQueryProps } from "../../repository/types/RepositoryTypes";
import { migrateBuilderAsync } from "../thunk/MigrationThunk";

export interface IInitialStateMigration {
  status: number;
  migrations: Array<IMigrationQueryProps>;
}

const initialState: IInitialStateMigration = {
  status: 0,
  migrations: [
    {
      name: "202301180056",
      query: [
        "CREATE TABLE IF NOT EXISTS tb_configuracao (id_configuracao INTEGER PRIMARY KEY AUTOINCREMENT, tx_captchahost VARCHAR(500));",
      ],
    },
    {
      name: "202301180058",
      query: [
        "CREATE TABLE IF NOT EXISTS tb_usuario (id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, tx_descricao VARCHAR(100), tx_email VARCHAR(100), tx_senha VARCHAR(100), tx_principal VARCHAR(1));",
      ],
    },
    {
      name: "202301181259",
      query: [
        "CREATE TABLE IF NOT EXISTS tb_carteira (id_carteira INTEGER PRIMARY KEY, tx_descricao VARCHAR(100), tx_uuid VARCHAR(100), tx_carteira VARCHAR(100), cd_tipo NUMERIC(3), vl_saldoresgate NUMERIC(188), tx_host VARCHAR(100), tx_refer VARCHAR(100));",
      ],
    },
    {
      name: "202301181631",
      query: [
        "CREATE TABLE IF NOT EXISTS tb_faucet (id_faucet INTEGER PRIMARY KEY AUTOINCREMENT, cd_carteira INTEGER, cd_usuario INTEGER, fl_ativo BOOLEAN, fl_situacao NUMERIC(3), dt_proximaexecucao TIMESTAMP, vl_saldoatual NUMERIC(188), FOREIGN KEY(cd_carteira) REFERENCES tb_carteira(id_carteira), FOREIGN KEY(cd_usuario) REFERENCES tb_usuario(id_usuario));",
      ],
    },
    {
      name: "202301271741",
      query: [
        "CREATE TABLE IF NOT EXISTS tb_execucaofaucet (id_execucaofaucet INTEGER PRIMARY KEY AUTOINCREMENT, cd_faucet INTEGER, dt_execucao TIMESTAMP, vl_roll NUMERIC(188), FOREIGN KEY(cd_faucet) REFERENCES tb_faucet(id_faucet));",
      ],
    },
    {
      name: "202301181345",
      query: [
        "insert into tb_carteira(id_carteira, tx_descricao, tx_uuid, cd_tipo, vl_saldoresgate, tx_host, tx_refer) values (1,'ADA', 'cardano', 0, 5, 'freecardano.com', 'https://freecardano.com/?ref=467018'),(2, 'BFG', 'bfg-token', 0, 100, 'freebfg.com', 'https://freebfg.com/?ref=4876'),(3, 'BNB', 'binancecoin', 0, 0.03, 'freebinancecoin.com', 'https://freebinancecoin.com/?ref=363498'),(4, 'BTC', 'bitcoin', 0, 0.0002, 'freebitcoin.io', 'https://freebitcoin.io/?ref=718462'),(6, 'BTT', 'bittorrent', 0, 2000000, 'freebittorrent.com', 'https://freebittorrent.com/?ref=11138'),(7, 'CAKE', 'pancakeswap-token', 0, 0.3, 'freepancake.com', 'https://freepancake.com/?ref=36227'),(8, 'DASH', 'dash', 0, 0.1, 'freedash.io', 'https://freedash.io/?ref=216098'),(9, 'DOGE', 'dogecoin', 0, 30, 'free-doge.com', 'https://free-doge.com/?ref=282676'),(10, 'ETH', 'ethereum', 0, 0.002, 'freeethereum.com', 'https://freeethereum.com/?ref=377836'),(11, 'MATIC', 'matic-network', 0, 1, 'freematic.com', 'https://freematic.com/?ref=51655'),(12, 'NEO', 'neo', 0, 1, 'freeneo.io', 'https://freeneo.io/?ref=158431'),(13, 'SHIB', 'shiba-inu', 0, 250000, 'freeshibainu.com', 'https://freeshibainu.com/?ref=147037'),(14, 'Steam', 'usd', 0, 5, 'freesteam.io', 'https://freesteam.io/?ref=172023'),(15, 'TRX', 'tron', 0, 40, 'free-tron.com', 'https://free-tron.com/?ref=453611'),(16, 'USDC', 'usd-coin', 0, 5, 'freeusdcoin.com', 'https://freeusdcoin.com/?ref=208724'),(17, 'USDT', 'tether', 0, 5, 'freetether.com', 'https://freetether.com/?ref=298043'),(18, 'XEM', 'nem', 0, 10, 'freenem.com', 'https://freenem.com/?ref=350870'),(19, 'XRP', 'ripple', 0, 5, 'coinfaucet.io', 'https://coinfaucet.io/?ref=934177'),(20, 'LTC', 'litecoin', 0, 0.1, 'free-ltc.com', 'https://free-ltc.com/?ref=237016')",
      ],
    },
    {
      name: "202301181346",
      query: [
        "insert into tb_configuracao(id_configuracao, tx_captchahost) values (1,'http://3.84.233.146')",
      ],
    },
    {
      name: "202301181347",
      query: ["alter table tb_faucet add column vl_saldoresgate numeric(18,0)"],
    },
    {
      name: "202301181348",
      query: [
        "alter table tb_faucet add column tx_carteiratransferencia varchar(255)",
      ],
    },
    {
      name: "20230702214800",
      query: ["alter table tb_carteira add column fl_referenciado boolean"],
    },
    {
      name: "20230702214900",
      query: ["alter table tb_usuario add column tx_refer varchar(255)"],
    },
  ],
};

const slice = createSlice({
  name: "migrations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    migrateBuilderAsync(builder);
  },
});

export default slice.reducer;
