import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import { AbstractRepository } from "./AbstractRepository";
import Carteira from "./model/carteira/Carteira";
import { ICarteiraProps } from "./model/carteira/Carteira.meta";

export default class CarteiraRepository extends AbstractRepository<ICarteiraProps> {

    constructor(db: WebSQLDatabase) {
        super(db);
    }

    public buscarCarteiras(): Promise<Array<ICarteiraProps>> {

        return this.list(Carteira.Builder());
    }


    public async atualizarSituacaoCarteira(codigoCarteira: number, ativo: boolean, registrada: boolean): Promise<void> {

        await this.doUpdate([{
            sql: 'update tb_carteira set fl_ativo=?, fl_registrado=? where id_carteira=?',
            args: [ativo, registrada, codigoCarteira]
        }]);
    }
}