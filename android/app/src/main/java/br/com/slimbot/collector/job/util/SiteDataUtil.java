package br.com.slimbot.collector.job.util;

import java.math.BigDecimal;

import br.com.slimbot.collector.job.vo.DadosPaginaVO;

public class SiteDataUtil {

    public static DadosPaginaVO obterDadosPagina(String siteData) {

        DadosPaginaVO dadosPaginaVO = new DadosPaginaVO();
        dadosPaginaVO.setLogged(isLogged(siteData));
        dadosPaginaVO.setCrsfToken(getCrsfToken(siteData));
        dadosPaginaVO.setSiteKey(getSiteKey(siteData));

        if (dadosPaginaVO.isLogged()) {

            dadosPaginaVO.setTimeOut(getTimeOut(siteData));
            dadosPaginaVO.setCaptcha(getCaptcha(siteData));
            dadosPaginaVO.setBalance(getBalance(siteData));
            dadosPaginaVO.setEmailValid(getEmailValid(siteData));

            if (dadosPaginaVO.isEmailValid() && dadosPaginaVO.getTimeOut() == 0) {
                dadosPaginaVO.setNumRolls(getRolls(siteData));
                dadosPaginaVO.setBalance(getBalance(siteData));
            }
        }

        return dadosPaginaVO;
    }

    private static boolean isLogged(String page) {

        return page.indexOf("<a href=\"/logout\">") > 0;
    }

    private static int getTimeOut(String data) {

        String strIndex = "var remainingSeconds =";

        int indexInicial = data.indexOf(strIndex);

        return Integer
                .valueOf(data.substring((indexInicial + strIndex.length()), data.indexOf(';', indexInicial)).trim());
    }

    private static boolean getEmailValid(String siteData) {

        return !siteData.contains("<div class=\"email-confirmation\">");
    }

    private static boolean getCaptcha(String siteData) {
        String strIndex = "var captcha =";

        int indexInicial = siteData.indexOf(strIndex);

        return Integer.valueOf(siteData
                .substring((indexInicial + strIndex.length()), siteData.indexOf(';', indexInicial)).trim()) != 1;
    }

    private static String getSiteKey(String data) {

        String strIndex = "sitekey: '";

        int indexInicial = data.indexOf(strIndex);

        return data.substring((indexInicial + strIndex.length()), data.indexOf("',", indexInicial)).trim();
    }

    private static BigDecimal getBalance(String data) {

        String strIndex = "<li class=\"navbar-coins bg-1 d-none";

        int indexInicial = data.indexOf(strIndex);

        String subData = data.substring(indexInicial + strIndex.length());

        return BigDecimal
                .valueOf(Double.valueOf(subData.substring(0, subData.indexOf("</a>")).replaceAll("[^0-9.]", "")));
    }

    private static int getRolls(String data) {

        String strIndex = "<span class=\"pending-rolls\">";

        int indexInicial = data.indexOf(strIndex);

        String subData = data.substring(indexInicial);

        return Integer.valueOf(subData.substring(0, subData.indexOf("</")).replaceAll("[^0-9]", ""));
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
