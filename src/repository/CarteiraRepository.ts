import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import { AbstractRepository } from "./AbstractRepository";
import {
  ICarteiraProps,
  IFaucetCarteiraProps,
} from "./model/carteira/Carteira.meta";
import { IReferenciaCarteiraProps } from "../service/CaptchaService";

export default class CarteiraRepository extends AbstractRepository<ICarteiraProps> {
  constructor(db: WebSQLDatabase) {
    super(db);
  }

  public async atualizarRefer(refer: IReferenciaCarteiraProps): Promise<any> {
    return await this.doUpdate([
      {
        sql: "update tb_carteira set tx_refer=? where tx_descricao=?",
        args: [refer.referencia, refer.carteira],
      },
    ]);
  }

  public async setarReferenciado(codigoCarteira: number): Promise<any> {
    return await this.doUpdate([
      {
        sql: "update tb_carteira set fl_referenciado=? where id_carteira=?",
        args: [true, codigoCarteira],
      },
    ]);
  }

  public async buscarCarteira(
    codigoCarteira: number
  ): Promise<IFaucetCarteiraProps> {
    return new Promise((resolve, reject) => {
      this.db.exec(
        [
          {
            sql: "select carteira.id_carteira as id, carteira.tx_descricao as descricao, carteira.tx_host as host, carteira.tx_refer as refer, carteira.fl_referenciado as referenciado, faucet.id_faucet as codigoFaucet, faucet.fl_ativo as ativo, faucet.fl_situacao as situacao, faucet.tx_carteiratransferencia as carteiratransferencia from tb_faucet faucet inner join tb_carteira carteira on faucet.cd_carteira=carteira.id_carteira where carteira.id_carteira=?",
            args: [codigoCarteira],
          },
        ],
        false,
        (error, results) => {
          if (error) {
            reject(`Não foi possível obter resultados - ${error}`);

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

          resolve(result.rows.map((item) => item as IFaucetCarteiraProps)[0]);
        }
      );
    });
  }
  public async buscarCarteiras(
    codigoUsuario: number
  ): Promise<Array<IFaucetCarteiraProps>> {
    return new Promise((resolve, reject) => {
      this.db.exec(
        [
          {
            sql: "select carteira.id_carteira as id, carteira.tx_descricao as descricao, carteira.tx_host as host, carteira.tx_refer as refer, carteira.fl_referenciado as referenciado, faucet.id_faucet as codigoFaucet, faucet.fl_ativo as ativo, faucet.fl_situacao as situacao, faucet.tx_carteiratransferencia as carteiratransferencia from tb_faucet faucet inner join tb_carteira carteira on faucet.cd_carteira=carteira.id_carteira where faucet.cd_usuario=?",
            args: [codigoUsuario],
          },
        ],
        false,
        (error, results) => {
          if (error) {
            reject(`Não foi possível obter resultados - ${error}`);

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

          resolve(result.rows.map((item) => item as IFaucetCarteiraProps));
        }
      );
    });
  }
}
