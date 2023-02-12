package br.com.slimbot.collector.repository.model;

public class Configuracao {

    private final int id;
    private final String descricao;
    private final String email;
    private final String senha;

    private final String captchaHost;

    public Configuracao(int id, String descricao, String email, String senha, String captchaHost) {
        this.id = id;
        this.descricao = descricao;
        this.email = email;
        this.senha = senha;
        this.captchaHost = captchaHost;
    }

    public int getId() {
        return id;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getEmail() {
        return email;
    }

    public String getSenha() {
        return senha;
    }


    public String getCaptchaHost() {
        return captchaHost;
    }
}
