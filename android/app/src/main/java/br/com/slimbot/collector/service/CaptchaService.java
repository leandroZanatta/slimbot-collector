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

    public String resolverCaptcha(CaptchaPropsVO captchaPropsVO) throws IOException {

        MediaType mediaType = MediaType.parse("application/json");

        RequestBody body = RequestBody.create(mediaType,
                String.format("{\"host\":\"%s\",\"siteKey\":\"%s\"}", captchaPropsVO.getHost(), captchaPropsVO.getSiteKey()));

        Request request = new Request.Builder()//
                .url(String.format("%s/api/v1/captcha/resolver",captchaPropsVO.getResolverHost()))//
                .method("POST", body)//
                .addHeader("Content-Type", "application/json").build();

        return client.newCall(request).execute().body().string();
    }

}
