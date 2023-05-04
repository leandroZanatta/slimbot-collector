import { arrayToMap } from "../../../utilitarios/ArrayToMap";
import { DBTypes } from "../../types/DBTypes";

import { IMetadataProps } from '../../types/RepositoryTypes';

export interface IUsuarioProps {
    id: number;
    descricao: string;
    email: string;
    senha: string;
    principal: string;
}

export const usuarioMetaData: IMetadataProps = {
    table: "tb_usuario",
    idProp: 'id',
    columns: arrayToMap('alias', [{
        alias: 'id',
        name: 'id_usuario',
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
    }, {
        alias: 'principal',
        name: 'tx_principal',
        field: DBTypes.VARCHAR_1,
        value: null,
        notNull: true
    }])
}