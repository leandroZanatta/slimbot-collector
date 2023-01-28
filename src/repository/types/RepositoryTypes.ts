export enum DBType {
    INTEGER,
    VARCHAR,
    NUMERIC,
    DATE,
    TIMESTAMP,
    BOOLEAN
}

export interface IMigrationQueryProps {
    name: string;
    query: Array<string>;
};

export interface IFieldTypeProps {
    type: DBType;
    precision?: number;
    scale?: number;
    pk?: boolean;
    ai?: boolean;
}

export interface IColumnProps {
    alias: string;
    name: string;
    field: IFieldTypeProps;
    value: any | null;
    notNull?: boolean;
}

export interface IMetadataProps {
    table: string;
    idProp: string;
    columns: Map<string, IColumnProps>;
    customMetaData?: Array<string>;
}
