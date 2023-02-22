package br.com.slimbot.collector;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import br.com.slimbot.collector.repository.CarteiraRepository;
import br.com.slimbot.collector.repository.ConfiguracaoRepository;
import br.com.slimbot.collector.repository.FaucetRepository;
import br.com.slimbot.collector.repository.model.Carteira;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.model.Faucet;
import br.com.slimbot.collector.service.FaucetRegister;

public class CadastroRunnable implements Runnable {

    private final CarteiraRepository carteiraRepository;
    private final ConfiguracaoRepository configuracaoRepository;
    private final FaucetRepository faucetRepository;

    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);

    public CadastroRunnable(File dbFile) {
        this.carteiraRepository = new CarteiraRepository(dbFile.getAbsolutePath());
        this.configuracaoRepository = new ConfiguracaoRepository(dbFile.getAbsolutePath());
        this.faucetRepository = new FaucetRepository(dbFile.getAbsolutePath());
    }

    @Override
    public void run() {

        List<Carteira> carteirasInativas = carteiraRepository.obterCarteirasInativas();
        Configuracao modeloConfiguracao = configuracaoRepository.obterConfiguracao();

        for (Carteira carteiraInativa : carteirasInativas) {

            Faucet faucet = faucetRepository.obterFaucetPorCarteira(carteiraInativa.getId());

            if (faucet == null) {

                faucet = new Faucet(0, carteiraInativa.getId(), modeloConfiguracao.getId(), sdf.format(new Date()), 0d);

                Long uuid = faucetRepository.salvarFaucet(faucet);

                faucet.setId(uuid.intValue());

            }
            FaucetRegister faucetRegister = new FaucetRegister(carteiraInativa, faucet.getId(), modeloConfiguracao);

            int retornoRegistro = faucetRegister.verifyRegister();
            boolean carteiraAtiva = retornoRegistro == 3;

            carteiraRepository.atualizarSituacaoCarteira(carteiraInativa.getId(), retornoRegistro, carteiraAtiva);
        }
    }
}
