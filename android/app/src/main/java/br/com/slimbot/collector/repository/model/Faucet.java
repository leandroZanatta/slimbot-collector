package br.com.slimbot.collector.repository.model;

import androidx.annotation.NonNull;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class Faucet {
    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);
    private int codigoFaucet;
    private String carteira;
    private String host;
    private String dataExecucao;
    private Double saldoAtual;
    public Faucet() {

    }
    public Faucet(int codigoFaucet, String carteira, String host, String dataExecucao, Double saldoAtual) {
        this.codigoFaucet = codigoFaucet;
        this.carteira = carteira;
        this.host = host;
        this.dataExecucao = dataExecucao;
        this.saldoAtual = saldoAtual;
    }

    public int getCodigoFaucet() {
        return codigoFaucet;
    }

    public void setCodigoFaucet(int codigoFaucet) {
        this.codigoFaucet = codigoFaucet;
    }

    public String getCarteira() {
        return carteira;
    }

    public void setCarteira(String carteira) {
        this.carteira = carteira;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public Date getDataExecucao() {
        try {
            return sdf.parse(dataExecucao);
        } catch (ParseException e) {

            e.printStackTrace();

            return null;
        }
    }

    public void setDataExecucao(String dataExecucao) {
        this.dataExecucao = dataExecucao;
    }

    public Double getSaldoAtual() {
        return saldoAtual;
    }

    public void setSaldoAtual(Double saldoAtual) {
        this.saldoAtual = saldoAtual;
    }

    @NonNull
    @Override
    public String toString() {
        return String.format("{codigoFaucet: %s, carteira:%s, host:%s, dataExecucao:%s, saldoAtual:%s}", codigoFaucet, carteira, host, dataExecucao, saldoAtual);
    }
}
