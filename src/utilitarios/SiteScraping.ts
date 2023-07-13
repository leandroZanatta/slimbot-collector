export const getCrsfToken = (data: string): string => {
  const strIndex: string = '<meta name="csrf-token" content="';

  const indexInicial: number = data.indexOf(strIndex);

  const retorno: string = data.substring(
    indexInicial + strIndex.length,
    data.indexOf("/>", indexInicial) - 1
  );

  if (retorno.endsWith('"')) {
    return retorno.substring(0, retorno.length - 1);
  }

  return retorno;
};

export const getCarteiraTransferencia = (data: string): string => {
  const strIndex: string =
    '<input type="text" class="form-control wallet-address" value="';

  const indexInicial: number = data.indexOf(strIndex);

  if (indexInicial >= 0) {
    const retorno: string = data.substring(
      indexInicial + strIndex.length,
      data.indexOf(">", indexInicial) - 1
    );

    if (retorno.endsWith('"')) {
      return retorno.substring(0, retorno.length - 1);
    }

    return retorno;
  }

  return "";
};

export const isLogged = (data: string): boolean => {
  return data.indexOf('<a href="/logout">') > 0;
};

export const isEmailValid = (data: string): boolean => {
  return data.indexOf('<div class="email-confirmation">') < 0;
};

export const getValorSaque = (data: string): number => {
  const strIndex: string = "MIN. RETIRADA";
  const indexInicial: number = data.indexOf(strIndex);

  const retorno: string = data.substring(
    indexInicial + strIndex.length,
    data.indexOf("')", indexInicial)
  );

  return parseFloat(retorno.replace(/[^0-9.]/g, ""));
};

export const getUrlReferencia = (data: string, hostname: string): string => {
  const strIndex: string = `https://${hostname}/?ref=`;

  const indexInicial: number = data.indexOf(strIndex);

  return data
    .substring(indexInicial, data.indexOf("</td>", indexInicial))
    .trim();
};

export const getSiteKey = (data: string): string => {
  const strIndex: string = "sitekey: '";

  const indexInicial: number = data.indexOf(strIndex);

  return data
    .substring(indexInicial + strIndex.length, data.indexOf("',", indexInicial))
    .trim();
};
