import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import { AbstractRepository } from "./AbstractRepository";
import { IConfiguracaoProps } from "./model/configuracao/Configuracao.meta";

export default class ConfiguracaoRepository extends AbstractRepository<IConfiguracaoProps> {

    constructor(db: WebSQLDatabase) {
        super(db);
    }
}