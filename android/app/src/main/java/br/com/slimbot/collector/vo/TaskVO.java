package br.com.slimbot.collector.vo;

import java.util.List;

public class TaskVO {

    private String key;
    private String type;
    private String titulo;
    private List<TaskImagemVO> imagens;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public List<TaskImagemVO> getImagens() {
        return imagens;
    }

    public void setImagens(List<TaskImagemVO> imagens) {
        this.imagens = imagens;
    }
}
