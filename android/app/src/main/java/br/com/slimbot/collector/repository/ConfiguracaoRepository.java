package br.com.slimbot.collector.repository;

import java.util.List;

import br.com.slimbot.collector.repository.model.Configuracao;

public class ConfiguracaoRepository extends AbstractRepository {

    public ConfiguracaoRepository(String dbPath) {
        super(dbPath);
    }

    public Configuracao obterConfiguracao() {

        List<Object[]> tupla = super.executeQuery("select id_configuracao, tx_descricao, tx_email, tx_senha from tb_configuracao");

        if (tupla.isEmpty()) {
            return null;
        }

        Object[] conf = tupla.get(0);

        return new Configuracao((Integer) conf[0], (String) conf[1], (String) conf[2], (String) conf[3],"http://54.144.137.196");
    }
}