import { arrayToMap } from "../../../utilitarios/ArrayToMap";
import { DBTypes } from "../../types/DBTypes";

import { IMetadataProps } from '../../types/RepositoryTypes';

export interface IConfiguracaoProps {
    id: number;
    descricao: string;
    email: string;
    senha: string;
    senhaEmail: string;
}

export const configuracaoMetaData: IMetadataProps = {
    table: "tb_configuracao",
    idProp: 'id',
    columns: arrayToMap('alias', [{
        alias: 'id',
        name: 'id_configuracao',
        field: DBTypes.INTEGERPKAI,
        value: null,
        notNull: true
    }, {
        alias: 'descricao',
        name: 'tx_descricao',
        field: DBTypes.VARCHAR_100,
        value: null,
        notNull: true
    }, {
        alias: 'email',
        name: 'tx_email',
        field: DBTypes.VARCHAR_100,
        value: null,
        notNull: true
    }, {
        alias: 'senha',
        name: 'tx_senha',
        field: DBTypes.VARCHAR_100,
        value: null,
        notNull: true
    }])
}