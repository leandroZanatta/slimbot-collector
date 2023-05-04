package br.com.slimbot.collector.repository.model;

public class Configuracao {

    private final int id;
    private final String captchaHost;

    public Configuracao(int id, String captchaHost) {
        this.id = id;
        this.captchaHost = captchaHost;
    }

    public int getId() {
        return id;
    }

    public String getCaptchaHost() {
        return captchaHost;
    }
}
