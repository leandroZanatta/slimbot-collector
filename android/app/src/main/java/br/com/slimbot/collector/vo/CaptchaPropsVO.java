package br.com.slimbot.collector.vo;

public class CaptchaPropsVO {
    private final String host;
    private final String siteKey;
    private final String captchaId;

    private final String resolverHost;

    public CaptchaPropsVO(String host, String siteKey, String captchaId, String resolverHost) {
        this.host = host;
        this.siteKey = siteKey;
        this.captchaId = captchaId;
        this.resolverHost = resolverHost;
    }

    public String getHost() {
        return host;
    }

    public String getSiteKey() {
        return siteKey;
    }

    public String getCaptchaId() {
        return captchaId;
    }


    public String getResolverHost() {
        return resolverHost;
    }
}
