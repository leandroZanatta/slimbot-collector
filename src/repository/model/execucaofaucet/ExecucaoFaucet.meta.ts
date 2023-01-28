import { arrayToMap } from "../../../utilitarios/ArrayToMap";
import { DBTypes } from "../../types/DBTypes";
import { IMetadataProps } from '../../types/RepositoryTypes';

export interface IExecucaoFaucetProps {
    id: number;
    codigoFaucet: number;
    dataExecucao: string;
    valorRoll: number;
}

export const execucaoFaucetMetaData: IMetadataProps = {
    table: "tb_execucaofaucet",
    idProp: 'id',
    columns: arrayToMap('alias', [{
        alias: 'id',
        name: 'id_execucaofaucet',
        field: DBTypes.INTEGERPKAI,
        value: null,
        notNull: true
    }, {
        alias: 'codigoFaucet',
        name: 'cd_faucet',
        field: DBTypes.INTEGER,
        value: null,
        notNull: true
    }, {
        alias: 'dataExecucao',
        name: 'dt_execucao',
        field: DBTypes.TIMESTAMP,
        value: null,
        notNull: true
    }, {
        alias: 'valorRoll',
        name: 'vl_roll',
        field: DBTypes.NUMERIC_18_8,
        value: null,
        notNull: true
    }]),
    customMetaData: [
        'FOREIGN KEY(cd_faucet) REFERENCES tb_faucet(id_faucet)'
    ]
}