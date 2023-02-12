package br.com.slimbot.collector.repository;

import java.util.ArrayList;
import java.util.List;

import br.com.slimbot.collector.repository.model.Faucet;

public class FaucetRepository extends AbstractRepository {

    public FaucetRepository(String dbPath) {
        super(dbPath);
    }

    public List<Faucet> obterFaucetExecucao() {

        List<Object[]> tupla = super.executeQuery("select faucet.id_faucet, carteira.tx_descricao, carteira.tx_host, faucet.dt_proximaexecucao, faucet.vl_saldoatual from tb_faucet faucet inner join tb_carteira carteira on faucet.cd_carteira=carteira.id_carteira where carteira.fl_ativo=true order by faucet.dt_proximaexecucao asc");
        List<Faucet> faucets = new ArrayList<>();
        if (tupla.isEmpty()) {
            return null;
        }

        for (int i = 0; i < tupla.size(); i++) {
            Object[] conf = tupla.get(i);

            Faucet faucet = new Faucet();
            faucet.setCodigoFaucet((Integer) conf[0]);
            faucet.setCarteira((String) conf[1]);
            faucet.setHost((String) conf[2]);
            faucet.setDataExecucao((String) conf[3]);
            faucet.setSaldoAtual(Double.valueOf(conf[4].toString()));

            faucets.add(faucet);
        }
        return faucets;
    }


}
