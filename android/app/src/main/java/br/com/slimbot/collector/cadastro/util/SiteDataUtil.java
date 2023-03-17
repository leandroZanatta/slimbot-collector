package br.com.slimbot.collector.cadastro.util;

import java.math.BigDecimal;

import br.com.slimbot.collector.cadastro.vo.DadosPaginaVO;


public class SiteDataUtil {

    public static DadosPaginaVO obterDadosPagina(String siteData) {

        DadosPaginaVO dadosPaginaVO = new DadosPaginaVO();
        dadosPaginaVO.setLogged(isLogged(siteData));
        dadosPaginaVO.setCrsfToken(getCrsfToken(siteData));
        dadosPaginaVO.setSiteKey(getSiteKey(siteData));

        if (dadosPaginaVO.isLogged()) {

            dadosPaginaVO.setEmailValid(getEmailValid(siteData));
        }

        return dadosPaginaVO;
    }

    private static boolean isLogged(String page) {

        return page.indexOf("<a href=\"/logout\">") > 0;
    }
    private static boolean getEmailValid(String siteData) {

        return !siteData.contains("<div class=\"email-confirmation\">");
    }

    private static String getSiteKey(String data) {

        String strIndex = "sitekey: '";

        int indexInicial = data.indexOf(strIndex);

        return data.substring((indexInicial + strIndex.length()), data.indexOf("',", indexInicial)).trim();
    }
    private static String getCrsfToken(String data) {

        String strIndex = "<meta name=\"csrf-token\" content=\"";

        int indexInicial = data.indexOf(strIndex);

        String retorno = data.substring((indexInicial + strIndex.length()), data.indexOf("/>", indexInicial) - 1);

        if (retorno.endsWith("\"")) {
            return retorno.substring(0, retorno.length() - 1);
        }

        return retorno;
    }
}
