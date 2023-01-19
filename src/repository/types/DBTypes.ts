import { DBType, IFieldTypeProps } from "./RepositoryTypes";


export const DBTypes = {

    INTEGERPKAI: {
        type: DBType.INTEGER,
        pk: true,
        ai: true
    },

    INTEGER: {
        type: DBType.INTEGER
    },

    INTEGERPK: {
        type: DBType.INTEGER,
        pk: true
    },

    VARCHAR_100: {
        type: DBType.VARCHAR,
        precision: 100
    },

    NUMERIC_18_0: {
        type: DBType.NUMERIC,
        precision: 18,
        scale: 0
    },

    NUMERIC_3_0: {
        type: DBType.NUMERIC,
        precision: 3,
        scale: 0
    },

    NUMERIC_18_2: {
        type: DBType.NUMERIC,
        precision: 18,
        scale: 2
    },

    DATE: {
        type: DBType.DATE,
    },

    TIMESTAMP: {
        type: DBType.TIMESTAMP,
    },

    BOOLEAN: {
        type: DBType.BOOLEAN,
    },

    NUMERIC_18_8: {
        type: DBType.NUMERIC,
        precision: 18,
        scale: 8
    },


}

export const mapType = (itemType: IFieldTypeProps): string => {

    let data = `${DBType[itemType.type]}`;

    if (itemType.precision) {
        data = data + `(${itemType.precision}${itemType.scale ? itemType.scale : ''})`;
    }

    if (itemType.pk) {
        data = data + ' PRIMARY KEY'
    }

    if (itemType.ai) {
        data = data + ' AUTOINCREMENT'
    }

    return data;
}