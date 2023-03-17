package br.com.slimbot.collector.cadastro.vo;

public class FaucetAuthorizationVO {
    private String host;
    private String urlAutorizacao;
    private Integer codigoFaucet;
    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getUrlAutorizacao() {
        return urlAutorizacao;
    }

    public void setUrlAutorizacao(String urlAutorizacao) {
        this.urlAutorizacao = urlAutorizacao;
    }

    public Integer getCodigoFaucet() {
        return codigoFaucet;
    }

    public void setCodigoFaucet(Integer codigoFaucet) {
        this.codigoFaucet = codigoFaucet;
    }
}
