
export const getCrsfToken = (data: string): string => {

    const strIndex: string = "<meta name=\"csrf-token\" content=\"";

    const indexInicial: number = data.indexOf(strIndex);

    const retorno: string = data.substring((indexInicial + strIndex.length), data.indexOf("/>", indexInicial) - 1);

    if (retorno.endsWith("\"")) {
        return retorno.substring(0, retorno.length - 1);
    }

    return retorno;
};

export const isLogged = (data: string): boolean => {

    return data.indexOf("<a href=\"/logout\">") > 0;
}

export const isEmailValid = (data: string): boolean => {

    return data.indexOf("<div class=\"email-confirmation\">") < 0;
}


export const getSiteKey = (data: string): string => {

    const strIndex: string = "sitekey: '";

    const indexInicial: number = data.indexOf(strIndex);

    return data.substring((indexInicial + strIndex.length), data.indexOf("',", indexInicial)).trim();
}



