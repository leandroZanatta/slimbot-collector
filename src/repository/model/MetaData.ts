import { Query } from "expo-sqlite/build/SQLite.types";
import { mapMetaDataToProperty } from "../../utilitarios/RepoPropertyMap";
import { mapType } from "../types/DBTypes";
import { IMetadataProps } from "../types/RepositoryTypes";

export abstract class MetaData<T> {
  protected props: IMetadataProps;

  constructor(props: IMetadataProps) {
    this.props = props;
  }

  protected setProperty(field: string, value: any) {
    let column = this.props.columns.get(field);

    if (column) {
      column.value = value;
    }
  }

  private mapColumns(): string {
    let columns: Array<string> = [];

    this.props.columns.forEach((value) =>
      columns.push(`${value.name} ${mapType(value.field)}`)
    );

    if (this.props.customMetaData) {
      this.props.customMetaData.forEach((custom) => columns.push(custom));
    }

    return columns.join(", \n");
  }

  public setId(value: any) {
    this.setProperty(this.props.idProp, value);
  }

  public getValues(): T {
    return mapMetaDataToProperty(this.props);
  }

  public getSelect(): Query {
    let args: Array<any> = [];
    let where: Array<string> = [];
    let cols: Array<string> = [];

    this.props.columns.forEach((column) => {
      cols.push(`${column.name} as ${column.alias}`);

      if (column.value != null) {
        where.push(`${column.name}=?`);
        args.push(column.value);
      }
    });

    return {
      sql: `SELECT ${cols.join(",")} FROM ${this.props.table}${
        where.length > 0 ? ` where ${where.join("and ")}` : ""
      } `,
      args: args,
    };
  }

  public getUpdate(): Query {
    let args: Array<any> = [];
    let cols: Array<string> = [];

    this.props.columns.forEach((column) => {
      if (!column.field.ai) {
        cols.push(column.name);
        args.push(column.value);
      }
    });

    args.push(this.props.columns.get(this.props.idProp)!.value);

    return {
      sql: `UPDATE ${this.props.table} SET ${cols
        .map((item) => `${item}=?`)
        .join(", ")} where ${
        this.props.columns.get(this.props.idProp)!.name
      }=?`,
      args: args,
    };
  }

  public getInsert(): Query {
    let args: Array<any> = [];
    let cols: Array<string> = [];

    this.props.columns.forEach((column) => {
      if (!column.field.ai) {
        cols.push(column.name);
        args.push(column.value);
      }
    });

    return {
      sql: `INSERT INTO ${this.props.table} (${cols.join(", ")}) VALUES (${cols
        .map((item) => "?")
        .join(", ")})`,
      args: args,
    };
  }

  public getDDL(): Array<string> {
    let ddl = [];

    ddl.push(`CREATE TABLE IF NOT EXISTS ${this.props.table} (
            ${this.mapColumns()}
        );`);

    return ddl;
  }
}
