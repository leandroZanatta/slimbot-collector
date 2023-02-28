package br.com.slimbot.collector.job.vo;

public class CaptchaPropsVO {
    private final String host;
    private final String siteKey;
    private final String resolverHost;

    public CaptchaPropsVO(String host, String siteKey, String resolverHost) {
        this.host = host;
        this.siteKey = siteKey;
        this.resolverHost = resolverHost;
    }

    public String getHost() {
        return host;
    }

    public String getSiteKey() {
        return siteKey;
    }

    public String getResolverHost() {
        return resolverHost;
    }
}
