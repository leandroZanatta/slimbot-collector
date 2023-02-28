package br.com.slimbot.collector.job.vo;

import java.math.BigDecimal;

public class ResultsCollectorVO {

    private boolean status;
    private String error;
    private int rollsPendentes;
    private BigDecimal coinsGanhos;
    private BigDecimal totalBalanco;
    private int proximoRoll;


    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public int getRollsPendentes() {
        return rollsPendentes;
    }

    public void setRollsPendentes(int rollsPendentes) {
        this.rollsPendentes = rollsPendentes;
    }

    public BigDecimal getCoinsGanhos() {
        return coinsGanhos;
    }

    public void setCoinsGanhos(BigDecimal coinsGanhos) {
        this.coinsGanhos = coinsGanhos;
    }

    public BigDecimal getTotalBalanco() {
        return totalBalanco;
    }

    public void setTotalBalanco(BigDecimal totalBalanco) {
        this.totalBalanco = totalBalanco;
    }

    public int getProximoRoll() {
        return proximoRoll;
    }

    public void setProximoRoll(int proximoRoll) {
        this.proximoRoll = proximoRoll;
    }
}