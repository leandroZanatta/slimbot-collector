import React, { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import useMigration from "../hooks/useMigrations";
import { IMigrationProps } from "../repository/types/RepositoryTypes";
import Configuracao from "../repository/model/configuracao/Configuracao";
import Carteira from "../repository/model/carteira/Carteira";
import Faucet from "../repository/model/faucet/Faucet";

export interface MigrationParams {
  db: WebSQLDatabase;
  migrated: boolean;
}

const migrations: Array<IMigrationProps> = [
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
    query: ["insert into tb_carteira(id_carteira,tx_descricao,cd_tipo,fl_ativo,vl_saldoresgate,fl_registrado) values (1,'ADA', 0, true, 5, false),(2, 'BFG', 0, true, 100, false),(3, 'BNB', 0, true, 0.03, false),(4, 'BTC', 0, true, 0.0002, false),(6, 'BTT', 0, true, 2000000, false),(7, 'CAKE', 0, true, 0.3, false),(8, 'DASH', 0, true, 0.1, false),(9, 'DOGE', 0, true, 30, false),(10, 'ETH', 0, true, 0.002, false),(11, 'MATIC', 0, true, 1, false),(12, 'NEO', 0, true, 1, false),(13, 'SHIB', 0, true, 50000, false),(14, 'Steam', 0, true, 5, false),(15, 'TRX', 0, true, 40, false),(16, 'USDC', 0, true, 5, false),(17, 'USDT', 0, true, 5, false),(18, 'XEM', 0, true, 10, false),(19, 'XRP', 0, true, 5, false)"],
  },
  {
    name: "202301181631",
    query: Faucet.Builder().getDDL(),
  },
];

const MigrationContext = React.createContext<MigrationParams | null>(null);

function MigrationProvider({ children }: any) {

  const db = SQLite.openDatabase("app3.db", "1");
  const [migrated, setMigrated] = useState<boolean>(false);

  const { migrate } = useMigration();

  const runMigrations = async () => {
    await migrate(db, migrations);

    setMigrated(true);
  };

  useEffect(() => { runMigrations() }, []);


  return (
    <MigrationContext.Provider value={{ db, migrated }}>
      {children}
    </MigrationContext.Provider>
  );
}

export { MigrationContext, MigrationProvider };
