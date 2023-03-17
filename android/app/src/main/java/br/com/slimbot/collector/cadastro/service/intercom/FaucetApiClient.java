package br.com.slimbot.collector.cadastro.service.intercom;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import br.com.slimbot.collector.cadastro.util.SiteDataUtil;
import br.com.slimbot.collector.cadastro.vo.DadosPaginaVO;
import br.com.slimbot.collector.cadastro.vo.FaucetAuthorizationVO;
import br.com.slimbot.collector.util.CookieStorage;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class FaucetApiClient {

    private final OkHttpClient client = new OkHttpClient();


    public DadosPaginaVO getCadastroPage(String host, Integer codigofaucet, String refer) throws IOException {
        CookieStorage.removeCookiesStorage(codigofaucet);

        Request.Builder builder = createDefaultBuilderHeaders(host)//
                .url(refer)//
                .header("Accept", "*/*");

        Response response = client.newCall(builder.build()).execute();

        CookieStorage.updateCookies(response,codigofaucet);

        return SiteDataUtil.obterDadosPagina(response.body().string());
    }

    public DadosPaginaVO obterDadosPagina(String host, Integer codigofaucet) throws IOException {

        Request.Builder builder = createDefaultBuilderHeaders(host)//
                .url(String.format("https://%s", host))//
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");

        CookieStorage.inserirCookies(builder, codigofaucet);

        Response response = client.newCall(builder.build()).execute();

        CookieStorage.updateCookies(response, codigofaucet);

        return SiteDataUtil.obterDadosPagina(response.body().string());
    }

    public int register(String host,Integer codigofaucet, String email, String senha, String crsfToken, String tokenId) throws IOException, JSONException {

        RequestBody body = new FormBody.Builder()
                .add("email", email)
                .add("password", senha)
                .add("password_confirmation", senha)
                .add("h-captcha-response", tokenId).build();

        Request.Builder builder = createDefaultBuilderHeaders(host).url(String.format("https://%s/register", host))
                .method("POST", body)//
                .addHeader("X-CSRF-TOKEN", crsfToken)//
                .addHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")//
                .addHeader("Accept", "application/json, text/javascript, */*; q=0.01");

        CookieStorage.inserirCookies(builder, codigofaucet);

        Response response = client.newCall(builder.build()).execute();

        String dados = response.body().string();

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

    public DadosPaginaVO autorizar(FaucetAuthorizationVO faucetAuthorizationVO) throws IOException {

        Request.Builder builder = createDefaultBuilderHeaders(faucetAuthorizationVO.getHost())//
                .url(faucetAuthorizationVO.getUrlAutorizacao())//
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");

        CookieStorage.inserirCookies(builder, faucetAuthorizationVO.getCodigoFaucet());

        Response response = client.newCall(builder.build()).execute();

        CookieStorage.updateCookies(response, faucetAuthorizationVO.getCodigoFaucet());

        return SiteDataUtil.obterDadosPagina(response.body().string());
    }

    public int efetuarLogin(DadosPaginaVO dadosPagina, String host, Integer codigoFaucet, String uuid, String email, String senha) throws IOException, JSONException {

        RequestBody body = new FormBody.Builder()
                .add("email", email)
                .add("password", senha)
                .add("h-captcha-response", uuid).build();

        Request.Builder builder = createDefaultBuilderHeaders(host).url(String.format("https://%s/login", host))
                .method("POST", body)//
                .addHeader("X-CSRF-TOKEN", dadosPagina.getCrsfToken())//
                .addHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")//
                .addHeader("Accept", "application/json, text/javascript, */*; q=0.01");

        CookieStorage.inserirCookies(builder, codigoFaucet);

        Response response = client.newCall(builder.build()).execute();

        String dados = response.body().string();

        JSONObject retorno = new JSONObject(dados);

        if (retorno.has("success") && retorno.getBoolean("success")) {

            CookieStorage.updateCookies(response, codigoFaucet);

            return 1;
        }

        if (retorno.has("message") && retorno.getString("message").equals("CSRF token mismatch.")) {

            CookieStorage.removeCookiesStorage(codigoFaucet);
            CookieStorage.updateCookies(response, codigoFaucet);

            return -1;
        }

        return 0;
    }

    private Request.Builder createDefaultBuilderHeaders(String host) {

        return new Request.Builder().addHeader("host", host)//
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
