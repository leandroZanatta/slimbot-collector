package br.com.slimbot.collector.repository.projection;

import androidx.annotation.NonNull;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class FaucetProjection {
    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);
    private int codigoFaucet;
    private String carteira;
    private String host;
    private String email;
    private String senha;
    private String dataExecucao;
    private Double saldoAtual;

    public FaucetProjection() {

    }

    public FaucetProjection(int codigoFaucet, String carteira, String host, String email, String senha, String dataExecucao, Double saldoAtual) {
        this.codigoFaucet = codigoFaucet;
        this.carteira = carteira;
        this.host = host;
        this.email = email;
        this.senha = senha;
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

            return new Date();
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

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
