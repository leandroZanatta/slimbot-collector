package br.com.slimbot.collector.repository.model;

import androidx.annotation.NonNull;

public class Faucet {

    private Integer id;
    private int codigoCarteira;
    private int codigoUsuario;
    private String proximaExecucao;
    private Double saldoAtual;

    public Faucet() {

    }

    public Faucet(Integer id, int codigoCarteira, int codigoUsuario, String proximaExecucao, Double saldoAtual) {
        this.setId(id);
        this.setCodigoCarteira(codigoCarteira);
        this.setCodigoUsuario(codigoUsuario);
        this.setProximaExecucao(proximaExecucao);
        this.setSaldoAtual(saldoAtual);
    }

    @NonNull
    @Override
    public String toString() {
        return String.format("{id: %s, codigoCarteira: %s, codigoUsuario:%s, proximaExecucao:%s, saldoAtual:%s}", getId(), getCodigoCarteira(), getCodigoUsuario(), getProximaExecucao(), getSaldoAtual());
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getCodigoCarteira() {
        return codigoCarteira;
    }

    public void setCodigoCarteira(int codigoCarteira) {
        this.codigoCarteira = codigoCarteira;
    }

    public int getCodigoUsuario() {
        return codigoUsuario;
    }

    public void setCodigoUsuario(int codigoUsuario) {
        this.codigoUsuario = codigoUsuario;
    }

    public String getProximaExecucao() {
        return proximaExecucao;
    }

    public void setProximaExecucao(String proximaExecucao) {
        this.proximaExecucao = proximaExecucao;
    }

    public Double getSaldoAtual() {
        return saldoAtual;
    }

    public void setSaldoAtual(Double saldoAtual) {
        this.saldoAtual = saldoAtual;
    }
}
