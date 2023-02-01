package br.com.slimbot.collector.service;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Base64;

import br.com.slimbot.collector.vo.CaptchaDataVO;
import br.com.slimbot.collector.vo.CaptchaPropsVO;
import br.com.slimbot.collector.vo.SiteConfigVO;
import br.com.slimbot.collector.vo.TaskVO;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class CaptchaService {

    private OkHttpClient client = new OkHttpClient().newBuilder().build();

    public String resolverCaptcha(CaptchaPropsVO captchaPropsVO) {

        String widgetId = this.randomWidgetId();

        SiteConfigVO siteConfig = this.obterSiteConfig(captchaPropsVO);

        TaskVO task = this.obterCaptcha(captchaPropsVO, siteConfig, widgetId);

        //   const resultado: RetornoCaptcha = await this.applySolution(captchaProps, siteConfig, task);


        return "";

    }

    private SiteConfigVO obterSiteConfig(CaptchaPropsVO captchaPropsVO) {

        SiteConfigVO siteConfigVO = new SiteConfigVO();

        String siteConfigURL = String.format("https://hcaptcha.com/checksiteconfig?v=%s&host=%s&sitekey=%s&sc=1&swa=1", captchaPropsVO.getCaptchaId(), captchaPropsVO.getHost(), captchaPropsVO.getSiteKey());

        MediaType mediaType = MediaType.parse("text/plain");

        RequestBody body = RequestBody.create(mediaType, "");

        Request request = new Request.Builder()
                .url(siteConfigURL)
                .method("POST", body)
                .addHeader("host", "hcaptcha.com")
                .addHeader("Accept", "application/json")
                .addHeader("sec-ch-ua", "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"")
                .addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36")
                .addHeader("Content-Type", "text/plain")
                .addHeader("Sec-Fetch-Dest", "empty")
                .addHeader("Sec-Fetch-Mode", "cors")
                .addHeader("Sec-Fetch-Site", "same-site")
                .addHeader("sec-ch-ua-mobile", "?0")
                .addHeader("sec-ch-ua-platform", "\"Windows\"")
                .build();

        try {
            Response response = client.newCall(request).execute();

            String data = response.body().string();

            JSONObject jsonResponse = new JSONObject(data);

            siteConfigVO.setPass(jsonResponse.getBoolean("pass"));
            siteConfigVO.setReq(jsonResponse.getJSONObject("c").getString("req"));
            siteConfigVO.setType(jsonResponse.getJSONObject("c").getString("type"));
        } catch (IOException | JSONException ex) {
            throw new RuntimeException("Não foi possível obter SiteConfig");
        }

        return siteConfigVO;
    }

    private TaskVO obterCaptcha(CaptchaPropsVO captchaPropsVO, SiteConfigVO siteConfig, String widgetId) {

        try {

            String autorizacao = this.obterAutorizacaoCaptcha(captchaPropsVO, siteConfig);

            MediaType mediaType = MediaType.parse("application/json");

            CaptchaDataVO captchaDataVO = new CaptchaDataVO();
            captchaDataVO.setHost(captchaPropsVO.getHost());
            captchaDataVO.setReq(siteConfig.getReq());
            captchaDataVO.setN(autorizacao);
            captchaDataVO.setVersion(captchaPropsVO.getCaptchaId());
            captchaDataVO.setSiteKey(captchaPropsVO.getSiteKey());
            captchaDataVO.setWidgetId(widgetId);

            RequestBody body = RequestBody.create(mediaType, captchaDataVO.toString());

            Request request = new Request.Builder()
                    .url(String.format("https://hcaptcha.com/getcaptcha/%s", captchaPropsVO.getSiteKey()))
                    .method("POST", body)
                    .addHeader("Accept", "application/json")
                    .addHeader("Content-type", "application/x-www-form-urlencoded")
                    .addHeader("Origin", captchaPropsVO.getHost())
                    .addHeader("Referer", captchaPropsVO.getHost())
                    .build();

            Response response = client.newCall(request).execute();

            String data = response.body().string();

            JSONObject jsonResponse = new JSONObject(data);


            TaskVO taskVO = new TaskVO();

            return taskVO;
        } catch (IOException | JSONException ex) {
            throw new RuntimeException("Não foi possível obter a task de imagens");
        }

    }

    private String randomWidgetId() {

        Double length = Math.floor(
                Math.random() * (12 - 10) + 10);

        StringBuilder buffer = new StringBuilder();

        String characters = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (int i = 0; i < length.intValue(); i++) {

            Double charAt = Math.floor(Math.random() * characters.length());

            buffer.append(characters.charAt(charAt.intValue()));
        }

        return buffer.toString();
    }

    private String obterAutorizacaoCaptcha(CaptchaPropsVO captchaPropsVO, SiteConfigVO siteConfig) {
        try {
            String param = new String(Base64.getDecoder().decode(siteConfig.getReq().split("\\.")[1]));

            String urlHsl = new JSONObject(param).getString("l");

            String url = String.format("%s/%s.js", urlHsl, siteConfig.getType());

            MediaType mediaType = MediaType.parse("application/json");

            RequestBody body = RequestBody.create(mediaType, String.format("{\"req\":\"%s\", \"content\":\"%s\"}", siteConfig.getReq(), url));

            Request request = new Request.Builder()
                    .url(captchaPropsVO.getResolverHost() + "/api/v1/captcha/hsw")
                    .addHeader("Content-Type", "application/json").method("POST", body).build();

            Response response = client.newCall(request).execute();

            String data = response.body().string();

            return data;

        } catch (RuntimeException | JSONException | IOException ioe) {
            throw new RuntimeException("Não foi possível obter autorização");
        }
    }
}
