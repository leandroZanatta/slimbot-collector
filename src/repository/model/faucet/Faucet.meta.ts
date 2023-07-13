import { arrayToMap } from "../../../utilitarios/ArrayToMap";
import { DBTypes } from "../../types/DBTypes";
import { IMetadataProps } from '../../types/RepositoryTypes';

export interface IFaucetCarteiraProps {
    id: number;
    codigoCarteira: number;
    codigoUsuario: number;
    carteira: string;
    proximaExecucao: string;
    saldoAtual: number;
    percentual: number;
    coletasEstimadas: number;
}

export interface IFaucetProps {
    id: number;
    codigoCarteira: number;
    codigoUsuario: number;
    proximaExecucao: string;
    saldoAtual: number;
    ativo: boolean;
    situacao: number; //0 - NAO-VALIDADA, 1 - REGISTRADA, 2 - JA_REGISTRADO, 3 - VALIDADO, 4 - ERRO_AUTENTICACAO
}

export const faucetMetaData: IMetadataProps = {
    table: "tb_faucet",
    idProp: 'id',
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
        alias: 'ativo',
        name: 'fl_ativo',
        field: DBTypes.BOOLEAN,
        value: null,
        notNull: true
    }, {
        alias: 'situacao',
        name: 'fl_situacao',
        field: DBTypes.NUMERIC_3_0,
        value: null
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
        'FOREIGN KEY(cd_usuario) REFERENCES tb_usuario(id_usuario)'
    ]
}