import { ResultSet, ResultSetError, WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import { MetaData } from "./model/MetaData";

export abstract class AbstractRepository<T> {

    protected db: WebSQLDatabase;

    constructor(db: WebSQLDatabase) {
        this.db = db;
    }

    public findFirst(data: MetaData<T>): Promise<T | null> {

        return new Promise((resolve, reject) => {
            this.db.exec([data.getSelect()], false, (error, results) => {
                if (error) {
                    reject(`Não foi possível salvar o objeto - ${error}`);

                    return;
                }

                if (!results) {
                    reject(`Não foi possível obter resultados`);

                    return;
                }

                const result = results[0];

                if (this.isResultSetError(result)) {
                    reject(`Não foi possível obter resultados -${result.error}`);
                    return;
                }

                let resultData = this.mapResultSet(result);

                if (Array.isArray(resultData)) {

                    resolve(resultData[0]);

                    return;
                }

                resolve(resultData);
            }
            );
        });
    }

    private isResultSetError = (r: any): r is ResultSetError => !!r.error;

    private mapResultSet(data: ResultSet): Array<T> | T | null {
        if (data.rows.length > 1) {

            return data.rows.map(item => item as T)
        }

        if (data.rows.length === 1) {

            return data.rows[0] as T;
        }

        return null;
    };

    public save(data: MetaData<T>): Promise<any> {

        return new Promise((resolve, reject) => {
            this.db.exec([data.getInsert()], false, (error, results) => {
                if (error) {
                    reject(`Não foi possível salvar o objeto - ${error}`);

                    return;
                }

                if (!results) {
                    reject(`Não foi possível obter resultados`);

                    return;
                }

                const result = results[0];

                if (this.isResultSetError(result)) {
                    reject(`Não foi possível obter resultados -${result.error}`);

                    return;
                }


                resolve(results[0]);
            }
            );
        });
    }

    public executeUpdate(sql: Array<string>): Promise<any> {

        return new Promise((resolve, reject) => {
            this.db.exec(sql.map(item => { return { sql: item, args: [] } }), false, (error, results) => {
                if (error) {
                    reject(`Não foi possível executar a query - ${error}`);

                    return;
                }

                if (!results) {
                    reject(`Não foi possível obter resultados`);

                    return;
                }

                const result = results[0];

                if (this.isResultSetError(result)) {
                    reject(`Não foi possível obter resultados -${result.error}`);
                    return;
                }

                resolve(results[0]);
            }
            );
        });
    }


}