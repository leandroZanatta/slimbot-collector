package br.com.slimbot.collector.repository.model;

import androidx.annotation.NonNull;

public class Carteira {
    private int id;
    private String descricao;
    private String host;
    private String refer;

    public Carteira() {

    }

    public Carteira(int id, String descricao, String host, String refer) {
        this.setId(id);
        this.setDescricao(descricao);
        this.setHost(host);
        this.setRefer(refer);
    }

    @NonNull
    @Override
    public String toString() {
        return String.format("{id: %s, descricao:%s, refer:%s}", getId(), getDescricao(), getRefer());
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }


    public String getRefer() {
        return refer;
    }

    public void setRefer(String refer) {
        this.refer = refer;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }
}
