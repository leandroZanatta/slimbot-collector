import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import { AbstractRepository } from "./AbstractRepository";
import { ICarteiraProps, IFaucetCarteiraProps } from "./model/carteira/Carteira.meta";

export default class CarteiraRepository extends AbstractRepository<ICarteiraProps> {

    constructor(db: WebSQLDatabase) {
        super(db);
    }

    public async buscarCarteiras(codigoUsuario: number): Promise<Array<IFaucetCarteiraProps>> {

        return new Promise((resolve, reject) => {
            this.db.exec([{
                sql: 'select carteira.id_carteira as id, carteira.tx_descricao as descricao, carteira.tx_host as host, carteira.tx_refer as refer, faucet.id_faucet as codigoFaucet, faucet.fl_ativo as ativo, faucet.fl_situacao as situacao from tb_faucet faucet inner join tb_carteira carteira on faucet.cd_carteira=carteira.id_carteira where faucet.cd_usuario=?',
                args: [codigoUsuario]
            }], false, (error, results) => {
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

                resolve(result.rows.map(item => item as IFaucetCarteiraProps));
            }
            );
        });

    }
}