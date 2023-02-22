package br.com.slimbot.collector.repository.model;

import androidx.annotation.NonNull;

public class Carteira {
    private int id;
    private String descricao;
    private boolean ativo;
    private int situacao;
    private String refer;
    public Carteira() {

    }
    public Carteira(int id, String descricao, boolean ativo, int situacao, String refer) {
        this.setId(id);
        this.setDescricao(descricao);
        this.setAtivo(ativo);
        this.setSituacao(situacao);
        this.setRefer(refer);
    }

    @NonNull
    @Override
    public String toString() {
        return String.format("{id: %s, descricao:%s, ativo:%s, situacao:%s, refer:%s}", getId(), getDescricao(), isAtivo() ?"S":"N", getSituacao() , getRefer());
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

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public int getSituacao() {
        return situacao;
    }

    public void setSituacao(int situacao) {
        this.situacao = situacao;
    }

    public String getRefer() {
        return refer;
    }

    public void setRefer(String refer) {
        this.refer = refer;
    }
}
