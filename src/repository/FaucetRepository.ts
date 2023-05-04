import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import moment from "moment";
import { AbstractRepository } from "./AbstractRepository";
import { IFaucetCarteiraProps, IFaucetProps } from "./model/faucet/Faucet.meta";

export default class FaucetRepository extends AbstractRepository<IFaucetProps> {

    constructor(db: WebSQLDatabase) {
        super(db);
    }

    public async atualizarSituacaoFaucet(codigoFaucet: number, ativo: boolean, situacao: number): Promise<void> {

        await this.doUpdate([{
            sql: 'update tb_faucet set fl_ativo=?, fl_situacao=? where id_faucet=?',
            args: [ativo, situacao, codigoFaucet]
        }]);
    }

    public async atualizarDadosFaucet(codigoCarteira: number, proximaExecucao: Date, valorBalanco: number) {

        await this.doUpdate([{
            sql: 'update tb_faucet set dt_proximaexecucao=?, vl_saldoatual=? where cd_carteira=?',
            args: [moment(proximaExecucao).format('YYYY-MM-DD HH:mm:ss'), valorBalanco, codigoCarteira]
        }]);
    }

    public async buscarFaucetCarteiraMenorTempo(): Promise<IFaucetCarteiraProps> {

        return new Promise((resolve, reject) => {
            this.db.exec([{
                sql: 'select faucet.id_faucet as id,carteira.tx_descricao as carteira, faucet.dt_proximaexecucao as proximaExecucao, faucet.vl_saldoatual as saldoAtual, carteira.id_carteira as codigoCarteira, (faucet.vl_saldoatual/carteira.vl_saldoresgate)*100 as percentual from tb_faucet faucet inner join tb_carteira carteira on faucet.cd_carteira=carteira.id_carteira where carteira.fl_ativo=? order by faucet.dt_proximaexecucao asc limit 1',
                args: [true]
            },], false, (error, results) => {

                if (error || !results || this.isResultSetError(results[0])) {
                    reject(`Não foi possível consultar o objeto - ${error}`);

                    return;
                }

                if (results[0].rows.length == 0) {
                    return null;
                }

                resolve(results[0].rows[0] as IFaucetCarteiraProps);
            }
            );
        });
    }

    public async buscarFaucetsCarteira(cdUsuario: number): Promise<Array<IFaucetCarteiraProps>> {
       
        return new Promise((resolve, reject) => {
            this.db.exec([{
                sql: 'select faucet.id_faucet as id,carteira.tx_descricao as carteira, faucet.dt_proximaexecucao as proximaExecucao, faucet.vl_saldoatual as saldoAtual, carteira.id_carteira as codigoCarteira, (faucet.vl_saldoatual/carteira.vl_saldoresgate)*100 as percentual  from tb_faucet faucet inner join tb_carteira carteira on faucet.cd_carteira=carteira.id_carteira where faucet.fl_ativo=? and faucet.cd_usuario=? order by faucet.dt_proximaexecucao asc',
                args: [true, cdUsuario]
            },], false, (error, results) => {
                if (error || !results || this.isResultSetError(results[0])) {
                    reject(`Não foi possível consultar o objeto - ${error}`);

                    return;
                }

                resolve(results[0].rows.map(item => item as IFaucetCarteiraProps));
            }
            );
        });
    }

    public async buscarFaucetCarteiraPorId(cdFaucet: number): Promise<IFaucetCarteiraProps> {

        return new Promise((resolve, reject) => {
            this.db.exec([{
                sql: 'select faucet.id_faucet as id, carteira.tx_descricao as carteira, faucet.dt_proximaexecucao as proximaExecucao, faucet.vl_saldoatual as saldoAtual, carteira.id_carteira as codigoCarteira, (faucet.vl_saldoatual/carteira.vl_saldoresgate)*100 as percentual from tb_faucet faucet inner join tb_carteira carteira on faucet.cd_carteira=carteira.id_carteira where carteira.fl_ativo=? and faucet.id_faucet=? limit 1',
                args: [true, cdFaucet]
            },], false, (error, results) => {

                if (error || !results || this.isResultSetError(results[0])) {
                    reject(`Não foi possível consultar o objeto - ${error}`);

                    return;
                }

                if (results[0].rows.length == 0) {
                    return null;
                }

                resolve(results[0].rows[0] as IFaucetCarteiraProps);
            }
            );
        });
    }

    public async obterMenorDataExecucao(): Promise<string> {

        return new Promise((resolve, reject) => {
            this.db.exec([{
                sql: 'select faucet.dt_proximaexecucao as dtExecucao from tb_faucet faucet inner join tb_carteira carteira on faucet.cd_carteira=carteira.id_carteira where carteira.fl_ativo=? order by faucet.dt_proximaexecucao asc limit 1',
                args: [true]
            },], false, (error, results) => {

                if (error || !results || this.isResultSetError(results[0])) {
                    reject(`Não foi possível consultar o objeto - ${error}`);

                    return;
                }

                resolve(results[0].rows[0].dtExecucao);
            }
            );
        });
    }
}