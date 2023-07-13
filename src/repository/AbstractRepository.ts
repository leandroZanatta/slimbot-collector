import {
  Query,
  ResultSet,
  ResultSetError,
  WebSQLDatabase,
} from "expo-sqlite/build/SQLite.types";
import { MetaData } from "./model/MetaData";

export abstract class AbstractRepository<T> {
  protected db: WebSQLDatabase;

  constructor(db: WebSQLDatabase) {
    this.db = db;
  }

  public list(data: MetaData<T>): Promise<Array<T>> {
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

        resolve(this.mapResultSet(result));
      });
    });
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

        if (result.rows.length == 0) {
          resolve(null);
        }

        resolve(this.mapResultSet(result)[0]);
      });
    });
  }

  protected isResultSetError = (r: any): r is ResultSetError => !!r.error;

  protected mapResultSet(data: ResultSet): Array<T> {
    return data.rows.map((item) => item as T);
  }

  public update(data: MetaData<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.exec([data.getUpdate()], false, (error, results) => {
        if (error) {
          reject(`Não foi possível alterar o objeto - ${error}`);

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

        resolve(data.getValues());
      });
    });
  }

  public save(data: MetaData<T>): Promise<T> {
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

        data.setId(result.insertId);

        resolve(data.getValues());
      });
    });
  }

  public executeUpdate(sql: Array<string>): Promise<any> {
    return this.doUpdate(
      sql.map((item) => {
        return { sql: item, args: [] };
      })
    );
  }

  public doUpdate(sqls: Array<Query>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.exec(sqls, false, (error, results) => {
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
      });
    });
  }
}
