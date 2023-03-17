package br.com.slimbot.collector.job.service.intercomm;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.math.BigDecimal;

import br.com.slimbot.collector.job.util.SiteDataUtil;
import br.com.slimbot.collector.job.vo.DadosPaginaVO;
import br.com.slimbot.collector.job.vo.ResultsCollectorVO;
import br.com.slimbot.collector.util.CookieStorage;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class FaucetApiClient {
    private final String host;
    private final int faucetId;
    private final OkHttpClient client = new OkHttpClient();
    public FaucetApiClient(String host, int faucetId) {
        this.host = host;
        this.faucetId = faucetId;
    }
    public DadosPaginaVO obterDadosPagina() throws IOException {

        Request.Builder builder = createDefaultBuilderHeaders()//
                .url(String.format("https://%s", this.host))//
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");

        CookieStorage.inserirCookies(builder, this.faucetId);

        Response response = client.newCall(builder.build()).execute();

        CookieStorage.updateCookies(response, this.faucetId);

        return SiteDataUtil.obterDadosPagina(response.body().string());
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

        CookieStorage.inserirCookies(builder, this.faucetId);

        Response response = client.newCall(builder.build()).execute();

        String dados = response.body().string();

        JSONObject retorno = new JSONObject(dados);

        if (retorno.has("success") && retorno.getBoolean("success")) {

            CookieStorage.updateCookies(response, this.faucetId);

            return 1;
        }

        if (retorno.has("message") && retorno.getString("message").equals("CSRF token mismatch.")) {

            CookieStorage.removeCookiesStorage( this.faucetId);
            CookieStorage.updateCookies(response, this.faucetId);

            return -1;
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

        CookieStorage.inserirCookies(builder, this.faucetId);

        ResultsCollectorVO resultsCollectorVO = new ResultsCollectorVO();

        Response response = client.newCall(builder.build()).execute();

        CookieStorage.updateCookies(response, this.faucetId);

        String dados = response.body().string();

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

}
