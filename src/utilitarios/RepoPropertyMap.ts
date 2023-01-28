import { IColumnProps, IMetadataProps } from "../repository/types/RepositoryTypes";

export const mapPropertyMetaData = (meta: IMetadataProps, props: any): IMetadataProps => {

    let keys = Object.keys(props);

    keys.forEach(key => {

        if (props[key] && props[key] != null) {

            let column: IColumnProps | undefined = meta.columns.get(key);

            if (column) {
                column.value = props[key];
            }
        }
    })

    return meta;
}


export const mapMetaDataToProperty = <T>(meta: IMetadataProps): T => {

    const ret: any = {};

    meta.columns.forEach(column => ret[column.alias] = column.value);

    return ret as T;
}