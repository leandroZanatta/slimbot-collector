package br.com.slimbot.collector.vo;

public class DadosPaginaVO {

    private boolean isLogged;
    private String crsfToken;
    private String siteKey;
    private int timeOut;
    private int numRolls;
    private Double balance;


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

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}
