package br.com.slimbot.collector.cadastro.vo;

import java.math.BigDecimal;

public class DadosPaginaVO {
    private boolean isLogged;
    private boolean emailValid;
    private String crsfToken;
    private String siteKey;
    public boolean isLogged() {
        return isLogged;
    }
    public void setLogged(boolean logged) {
        isLogged = logged;
    }
    public String getCrsfToken() {
        return crsfToken;
    }
    public void setCrsfToken(String crsfToken) {
        this.crsfToken = crsfToken;
    }
    public String getSiteKey() {
        return siteKey;
    }
    public void setSiteKey(String siteKey) {
        this.siteKey = siteKey;
    }
    public boolean isEmailValid() {
        return emailValid;
    }
    public void setEmailValid(boolean emailValid) {
        this.emailValid = emailValid;
    }
}
