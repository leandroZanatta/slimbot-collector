import { arrayToMap } from "../../../utilitarios/ArrayToMap";
import { DBTypes } from "../../types/DBTypes";

import { IMetadataProps } from '../../types/RepositoryTypes';

export interface ICarteiraProps {
    id: number;
    descricao: string;
    carteira: string;
    tipo: number;
    ativo: boolean;
    saldoResgate: number;
    situacao: number; //0 - NAO-VALIDADA, 1 - REGISTRADA, 2 - JA_REGISTRADO, 3 - VALIDADO, 4 - ERRO_AUTENTICACAO
    host: string;
    refer: string;
}

export const carteiraMetaData: IMetadataProps = {
    table: "tb_carteira",
    idProp: 'id',
    columns: arrayToMap('alias', [{
        alias: 'id',
        name: 'id_carteira',
        field: DBTypes.INTEGERPK,
        value: null,
        notNull: true
    }, {
        alias: 'descricao',
        name: 'tx_descricao',
        field: DBTypes.VARCHAR_100,
        value: null,
        notNull: true
    }, {
        alias: 'carteira',
        name: 'tx_carteira',
        field: DBTypes.VARCHAR_100,
        value: null,
    }, {
        alias: 'tipo',
        name: 'cd_tipo',
        field: DBTypes.NUMERIC_3_0,
        value: null,
        notNull: true
    }, {
        alias: 'ativo',
        name: 'fl_ativo',
        field: DBTypes.BOOLEAN,
        value: null,
        notNull: true
    }, {
        alias: 'saldoResgate',
        name: 'vl_saldoresgate',
        field: DBTypes.NUMERIC_18_8,
        value: null,
        notNull: true
    }, {
        alias: 'situacao',
        name: 'fl_situacao',
        field: DBTypes.NUMERIC_3_0,
        value: null
    }, {
        alias: 'host',
        name: 'tx_host',
        field: DBTypes.VARCHAR_100,
        value: null,
    }, {
        alias: 'refer',
        name: 'tx_refer',
        field: DBTypes.VARCHAR_100,
        value: null,
    }])
}