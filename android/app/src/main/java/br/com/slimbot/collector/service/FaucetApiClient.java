package br.com.slimbot.collector.service;

import android.os.Build;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.stream.Collectors;

import br.com.slimbot.collector.util.CookieStorage;
import br.com.slimbot.collector.vo.DadosPaginaVO;
import br.com.slimbot.collector.vo.ResultsCollectorVO;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class FaucetApiClient {

    private final static String LOG_TAG = "FaucetApiClient";

    private final String host;
    private final int faucetId;
    private final OkHttpClient client = new OkHttpClient();

    public FaucetApiClient(String host, int faucetId) {
        this.host = host;
        this.faucetId = faucetId;
    }

    public DadosPaginaVO getCadastroPage(String refer) throws IOException {
        DadosPaginaVO dadosPaginaVO = new DadosPaginaVO();
        CookieStorage.removeCookiesStorage(this.faucetId);

        Request.Builder builder = createDefaultBuilderHeaders()//
                .url(refer)//
                .header("Accept", "*/*");

        Response response = client.newCall(builder.build()).execute();

        updateCookies(response);

        String siteData = response.body().string();

        dadosPaginaVO.setCrsfToken(getCrsfToken(siteData));
        dadosPaginaVO.setSiteKey(getSiteKey(siteData));

        return dadosPaginaVO;
    }

    public int register(String email, String senha, String crsfToken, String tokenId) throws IOException, JSONException {

        RequestBody body = new FormBody.Builder()
                .add("email", email)
                .add("password", senha)
                .add("password_confirmation", senha)
                .add("h-captcha-response", tokenId).build();

        Request.Builder builder = createDefaultBuilderHeaders().url(String.format("https://%s/register", this.host))
                .method("POST", body)//
                .addHeader("X-CSRF-TOKEN", crsfToken)//
                .addHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")//
                .addHeader("Accept", "application/json, text/javascript, */*; q=0.01");

        inserirCookies(builder);

        Response response = client.newCall(builder.build()).execute();

        String dados = response.body().string();

        Log.i(LOG_TAG, "Retorno Cadastro " + this.host + ": " + dados);

        JSONObject retorno = new JSONObject(dados);

        if (retorno.has("success")) {

            if (retorno.getBoolean("success")) {
                return 1;
            }

            if (!retorno.getBoolean("success") && retorno.has("error")) {

                JSONArray jsonArray = retorno.getJSONArray("error");

                for (int i = 0; i < jsonArray.length(); i++) {

                    if (jsonArray.getString(i).contains("more than one account")) {
                        //Tentando criar mais de uma conta com mesmo IP
                        return 2;
                    }

                    if (jsonArray.getString(i).contains("email has already been taken.")) {
                        return 2;
                    }
                }
            }
        }

        if (retorno.has("status")) {

            if (!retorno.getBoolean("status") && retorno.has("error")) {

                JSONArray jsonArray = retorno.getJSONArray("error");

                for (int i = 0; i < jsonArray.length(); i++) {

                    if (jsonArray.getString(i).contains("email has already been taken.")) {
                        return 2;
                    }
                }
            }
        }
        return 0;
    }

    public DadosPaginaVO autorizar(String urlExecucao)throws IOException {

        Request.Builder builder = createDefaultBuilderHeaders()//
                .url(urlExecucao)//
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");

        inserirCookies(builder);

        Response response = client.newCall(builder.build()).execute();

        updateCookies(response);

        String siteData = response.body().string();

        Log.i(LOG_TAG, "Retorno Auth: " + siteData);

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

    public DadosPaginaVO obterDadosPagina() throws IOException {

        Request.Builder builder = createDefaultBuilderHeaders()//
                .url(String.format("https://%s", this.host))//
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");

        inserirCookies(builder);

        Response response = client.newCall(builder.build()).execute();

        updateCookies(response);

        String siteData = response.body().string();

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

    public int efetuarLogin(DadosPaginaVO dadosPagina, String uuid, String email, String senha) throws IOException, JSONException {

        RequestBody body = new FormBody.Builder()
                .add("email", email)
                .add("password", senha)
                .add("h-captcha-response", uuid).build();

        Request.Builder builder = createDefaultBuilderHeaders().url(String.format("https://%s/login", this.host))
                .method("POST", body)//
                .addHeader("X-CSRF-TOKEN", dadosPagina.getCrsfToken())//
                .addHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")//
                .addHeader("Accept", "application/json, text/javascript, */*; q=0.01");

        this.inserirCookies(builder);

        Response response = client.newCall(builder.build()).execute();

        String dados = response.body().string();

        Log.i(LOG_TAG, "Retorno Login: " + dados);

        JSONObject retorno = new JSONObject(dados);

        if (retorno.has("success") && retorno.getBoolean("success")) {

            updateCookies(response);

            return 1;
        }

        return 0;
    }

    public ResultsCollectorVO efetuarRoll(String captchaId, DadosPaginaVO dadosPaginaVO) throws IOException, JSONException {

        RequestBody body = new FormBody.Builder().add("h-captcha-response", captchaId).build();

        Request.Builder builder = createDefaultBuilderHeaders().url(String.format("https://%s/ajax-roll", this.host))
                .method("POST", body)//
                .addHeader("X-CSRF-TOKEN", dadosPaginaVO.getCrsfToken())//
                .addHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")//
                .addHeader("Accept", "*/*");

        this.inserirCookies(builder);

        ResultsCollectorVO resultsCollectorVO = new ResultsCollectorVO();

        Response response = client.newCall(builder.build()).execute();

        updateCookies(response);

        String dados = response.body().string();

        Log.i(LOG_TAG, "Retorno Roll: " + dados);

        JSONObject retorno = new JSONObject(dados);

        resultsCollectorVO.setStatus(retorno.getBoolean("status"));

        if (resultsCollectorVO.isStatus()) {

            resultsCollectorVO.setCoinsGanhos(BigDecimal.valueOf(retorno.getDouble("coins_won")));
            resultsCollectorVO.setProximoRoll(retorno.getInt("remaining_seconds"));
            resultsCollectorVO.setRollsPendentes(retorno.getInt("pending_rolls"));
            resultsCollectorVO.setTotalBalanco(BigDecimal.valueOf(retorno.getDouble("total_coins")));

            dadosPaginaVO.setNumRolls(resultsCollectorVO.getRollsPendentes());
        } else {
            resultsCollectorVO.setError(retorno.getString("error"));
        }

        return resultsCollectorVO;
    }

    private void inserirCookies(Request.Builder builder) {

        Collection<String> cookies = CookieStorage.getCookiesStorage(this.faucetId).values();

        if (!cookies.isEmpty()) {
            String dadosCookie = "";

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                dadosCookie = cookies.stream().collect(Collectors.joining(";"));
            } else {
                for (String itemCookie : cookies) {
                    if (!dadosCookie.isEmpty()) {
                        dadosCookie = dadosCookie + ';' + itemCookie;
                    }
                }
            }

            builder.header("Cookie", dadosCookie);
        }
    }

    private void updateCookies(Response response) {
        if (response.headers().names().contains("set-cookie")) {
            CookieStorage.setCookiesStorage(this.faucetId, response.headers("set-cookie"));
        }
    }

    private Request.Builder createDefaultBuilderHeaders() {

        return new Request.Builder().addHeader("host", this.host)//
                .addHeader("sec-ch-ua", "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"")//
                .addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36")//
                .addHeader("Accept", "application/json, text/javascript, */*; q=0.01")//
                .addHeader("Sec-Fetch-Dest", "empty")//
                .addHeader("Sec-Fetch-Mode", "cors")//
                .addHeader("Sec-Fetch-Site", "same-origin")//
                .addHeader("X-Requested-With", "XMLHttpRequest")//
                .addHeader("sec-ch-ua-mobile", "?0")//
                .addHeader("sec-ch-ua-platform", "\"Windows\"");//
    }

    private boolean isLogged(String page) {

        return page.indexOf("<a href=\"/logout\">") > 0;
    }

    private int getTimeOut(String data) {

        String strIndex = "var remainingSeconds =";

        int indexInicial = data.indexOf(strIndex);

        return Integer
                .valueOf(data.substring((indexInicial + strIndex.length()), data.indexOf(';', indexInicial)).trim());
    }

    private boolean getEmailValid(String siteData) {

        return !siteData.contains("<div class=\"email-confirmation\">");
    }

    private boolean getCaptcha(String siteData) {
        String strIndex = "var captcha =";

        int indexInicial = siteData.indexOf(strIndex);

        return Integer.valueOf(siteData
                .substring((indexInicial + strIndex.length()), siteData.indexOf(';', indexInicial)).trim()) != 1;
    }

    private String getSiteKey(String data) {

        String strIndex = "sitekey: '";

        int indexInicial = data.indexOf(strIndex);

        return data.substring((indexInicial + strIndex.length()), data.indexOf("',", indexInicial)).trim();
    }

    private BigDecimal getBalance(String data) {

        String strIndex = "<li class=\"navbar-coins bg-1 d-none";

        int indexInicial = data.indexOf(strIndex);

        String subData = data.substring(indexInicial + strIndex.length());

        return BigDecimal
                .valueOf(Double.valueOf(subData.substring(0, subData.indexOf("</a>")).replaceAll("[^0-9.]", "")));
    }

    private int getRolls(String data) {

        String strIndex = "<span class=\"pending-rolls\">";

        int indexInicial = data.indexOf(strIndex);

        String subData = data.substring(indexInicial);

        return Integer.valueOf(subData.substring(0, subData.indexOf("</")).replaceAll("[^0-9]", ""));
    }

    private String getCrsfToken(String data) {

        String strIndex = "<meta name=\"csrf-token\" content=\"";

        int indexInicial = data.indexOf(strIndex);

        String retorno = data.substring((indexInicial + strIndex.length()), data.indexOf("/>", indexInicial) - 1);

        if (retorno.endsWith("\"")) {
            return retorno.substring(0, retorno.length() - 1);
        }

        return retorno;
    }



}
