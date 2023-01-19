import { arrayToMap } from "../../../utilitarios/ArrayToMap";
import { DBTypes } from "../../types/DBTypes";

import { IMetadataProps } from '../../types/RepositoryTypes';

export interface IMigrationProps {
    id: string;
    execucao: string;
}

export const migrationMetaData: IMetadataProps = {
    table: "tb_migration",
    columns: arrayToMap('alias', [{
        alias: 'id',
        name: 'id_migration',
        field: DBTypes.INTEGERPK,
        value: null,
        notNull: true
    }, {
        alias: 'execucao',
        name: 'dt_execucao',
        field: DBTypes.TIMESTAMP,
        value: null,
        notNull: true
    }])
}