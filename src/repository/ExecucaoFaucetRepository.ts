import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import { AbstractRepository } from "./AbstractRepository";
import { IExecucaoFaucetProps } from "./model/execucaofaucet/ExecucaoFaucet.meta";


export default class ExecucaoFaucetRepository extends AbstractRepository<IExecucaoFaucetProps> {

    constructor(db: WebSQLDatabase) {
        super(db);
    }


}