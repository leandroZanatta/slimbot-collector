import { arrayToMap } from "../../../utilitarios/ArrayToMap";
import { DBTypes } from "../../types/DBTypes";

import { IMetadataProps } from "../../types/RepositoryTypes";

export interface IConfiguracaoProps {
  id: number;
  captchaHost: string;
}

export const configuracaoMetaData: IMetadataProps = {
  table: "tb_configuracao",
  idProp: "id",
  columns: arrayToMap("alias", [
    {
      alias: "id",
      name: "id_configuracao",
      field: DBTypes.INTEGERPKAI,
      value: null,
      notNull: true,
    },
    {
      alias: "captchaHost",
      name: "tx_captchahost",
      field: DBTypes.VARCHAR_500,
      value: null,
      notNull: true,
    },
  ]),
};
