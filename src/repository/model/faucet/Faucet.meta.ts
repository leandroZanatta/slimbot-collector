import { arrayToMap } from "../../../utilitarios/ArrayToMap";
import { DBTypes } from "../../types/DBTypes";
import { IMetadataProps } from '../../types/RepositoryTypes';

export interface IFaucetProps {
    id: number;
    codigoCarteira: number;
    codigoUsuario: number;
    proximaExecucao: string;
    saldoAtual: number;
}

export const faucetMetaData: IMetadataProps = {
    table: "tb_faucet",
    columns: arrayToMap('alias', [{
        alias: 'id',
        name: 'id_faucet',
        field: DBTypes.INTEGERPKAI,
        value: null,
        notNull: true
    }, {
        alias: 'codigoCarteira',
        name: 'cd_carteira',
        field: DBTypes.INTEGER,
        value: null,
        notNull: true
    }, {
        alias: 'codigoUsuario',
        name: 'cd_usuario',
        field: DBTypes.INTEGER,
        value: null,
        notNull: true
    }, {
        alias: 'proximaExecucao',
        name: 'dt_proximaexecucao',
        field: DBTypes.TIMESTAMP,
        value: null,
        notNull: true
    }, {
        alias: 'saldoAtual',
        name: 'vl_saldoatual',
        field: DBTypes.NUMERIC_18_8,
        value: null,
        notNull: true
    }]),
    customMetaData: [
        'FOREIGN KEY(cd_carteira) REFERENCES tb_carteira(id_carteira)',
        'FOREIGN KEY(cd_usuario) REFERENCES tb_configuracao(id_configuracao)'
    ]
}