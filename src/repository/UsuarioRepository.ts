import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import { AbstractRepository } from "./AbstractRepository";
import { IUsuarioProps } from "./model/usuario/Usuario.meta";

export default class UsuarioRepository extends AbstractRepository<IUsuarioProps> {
  constructor(db: WebSQLDatabase) {
    super(db);
  }

  public async atualizarRefer(refer: string): Promise<any> {
    return await this.doUpdate([
      {
        sql: "update tb_usuario set tx_refer=?",
        args: [refer],
      },
    ]);
  }

  alterarSituacaoUsuario = (codigoUsuario: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.db.exec(
        [
          {
            sql: `UPDATE tb_usuario SET tx_principal= 'N'`,
            args: [],
          },
          {
            sql: `UPDATE tb_usuario SET tx_principal= 'S' WHERE id_usuario = ?`,
            args: [codigoUsuario],
          },
        ],
        false,
        (error, results) => {
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
  };
}
