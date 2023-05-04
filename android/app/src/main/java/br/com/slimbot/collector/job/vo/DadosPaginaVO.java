package br.com.slimbot.collector.job.vo;

import java.math.BigDecimal;

public class DadosPaginaVO {
    private boolean isLogged;
    private boolean emailValid;
    private String crsfToken;
    private String siteKey;
    private int timeOut;
    private int numRolls;
    private BigDecimal balance;
    private boolean captcha;

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

    public int getTimeOut() {
        return timeOut;
    }

    public void setTimeOut(int timeOut) {
        this.timeOut = timeOut;
    }

    public int getNumRolls() {
        return numRolls;
    }

    public void setNumRolls(int numRolls) {
        this.numRolls = numRolls;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public boolean isCaptcha() {
        return captcha;
    }

    public void setCaptcha(boolean captcha) {
        this.captcha = captcha;
    }

    public boolean isEmailValid() {
        return emailValid;
    }

    public void setEmailValid(boolean emailValid) {
        this.emailValid = emailValid;
    }
}
