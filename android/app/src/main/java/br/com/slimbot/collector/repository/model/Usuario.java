package br.com.slimbot.collector.repository.model;

public class Usuario {
    private int id;
    private String descricao;
    private String email;
    private String senha;
    private String principal;

    public Usuario() {

    }

    public Usuario(int id, String descricao, String email, String senha, String principal) {
        this.setId(id);
        this.setDescricao(descricao);
        this.setEmail(email);
        this.setSenha(senha);
        this.setPrincipal(principal);
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getPrincipal() {
        return principal;
    }

    public void setPrincipal(String principal) {
        this.principal = principal;
    }
}