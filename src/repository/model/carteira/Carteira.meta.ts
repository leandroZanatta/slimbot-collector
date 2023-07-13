import { arrayToMap } from "../../../utilitarios/ArrayToMap";
import { DBTypes } from "../../types/DBTypes";
import { IMetadataProps } from "../../types/RepositoryTypes";

export interface IFaucetCarteiraProps {
  id: number;
  codigoFaucet: number;
  descricao: string;
  carteiratransferencia: string | null;
  ativo: boolean;
  situacao: number;
  host: string;
  refer: string;
  referenciado: boolean;
}

export interface ICarteiraProps {
  id: number;
  descricao: string;
  uuid: string;
  carteira: string;
  tipo: number;
  saldoResgate: number;
  host: string;
  refer: string;
  referenciado: boolean;
}

export const carteiraMetaData: IMetadataProps = {
  table: "tb_carteira",
  idProp: "id",
  columns: arrayToMap("alias", [
    {
      alias: "id",
      name: "id_carteira",
      field: DBTypes.INTEGERPK,
      value: null,
      notNull: true,
    },
    {
      alias: "descricao",
      name: "tx_descricao",
      field: DBTypes.VARCHAR_100,
      value: null,
      notNull: true,
    },
    {
      alias: "uuid",
      name: "tx_uuid",
      field: DBTypes.VARCHAR_100,
      value: null,
    },
    {
      alias: "carteira",
      name: "tx_carteira",
      field: DBTypes.VARCHAR_100,
      value: null,
    },
    {
      alias: "tipo",
      name: "cd_tipo",
      field: DBTypes.NUMERIC_3_0,
      value: null,
      notNull: true,
    },
    {
      alias: "saldoResgate",
      name: "vl_saldoresgate",
      field: DBTypes.NUMERIC_18_8,
      value: null,
      notNull: true,
    },
    {
      alias: "host",
      name: "tx_host",
      field: DBTypes.VARCHAR_100,
      value: null,
    },
    {
      alias: "refer",
      name: "tx_refer",
      field: DBTypes.VARCHAR_100,
      value: null,
    },
    {
      alias: "referenciado",
      name: "fl_referenciado",
      field: DBTypes.BOOLEAN,
      value: null,
    },
  ]),
};
