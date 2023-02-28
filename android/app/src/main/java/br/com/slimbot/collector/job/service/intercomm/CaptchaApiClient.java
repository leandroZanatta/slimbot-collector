package br.com.slimbot.collector.job.service.intercomm;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import br.com.slimbot.collector.vo.CaptchaPropsVO;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;

public class CaptchaApiClient {
    private OkHttpClient client =new OkHttpClient.Builder().connectTimeout(10, TimeUnit.SECONDS)
            .writeTimeout(10, TimeUnit.SECONDS).readTimeout(60, TimeUnit.SECONDS).build();;
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
