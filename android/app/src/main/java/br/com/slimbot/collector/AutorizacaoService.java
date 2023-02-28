package br.com.slimbot.collector;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Locale;

import br.com.slimbot.collector.repository.CarteiraRepository;
import br.com.slimbot.collector.repository.ConfiguracaoRepository;
import br.com.slimbot.collector.repository.FaucetRepository;
import br.com.slimbot.collector.repository.model.Carteira;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.model.Faucet;
import br.com.slimbot.collector.register.service.FaucetRegister;
import br.com.slimbot.collector.vo.DadosPaginaVO;

public class AutorizacaoService  {

    private final CarteiraRepository carteiraRepository;
    private final ConfiguracaoRepository configuracaoRepository;
    private final FaucetRepository faucetRepository;

    private final int codigoCarteira;
    private final String urlExecucao;
    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);

    public AutorizacaoService(File dbFile, int codigoCarteira, String urlExecucao) {
        this.codigoCarteira = codigoCarteira;
        this.urlExecucao = urlExecucao;
        this.carteiraRepository = new CarteiraRepository(dbFile.getAbsolutePath());
        this.configuracaoRepository = new ConfiguracaoRepository(dbFile.getAbsolutePath());
        this.faucetRepository = new FaucetRepository(dbFile.getAbsolutePath());
    }


    public void authorize() {

        Carteira carteira = carteiraRepository.obterPorId(this.codigoCarteira);

        if (carteira.getSituacao() == 1) {

            Configuracao modeloConfiguracao = configuracaoRepository.obterConfiguracao();

            Faucet faucet = faucetRepository.obterFaucetPorCarteira(carteira.getId());

            FaucetRegister faucetRegister = new FaucetRegister(carteira, faucet.getId(), modeloConfiguracao);

            DadosPaginaVO dadosPaginaVO = faucetRegister.auhorize(urlExecucao);

            if (dadosPaginaVO.isLogged() && dadosPaginaVO.isEmailValid()) {

                carteiraRepository.atualizarSituacaoCarteira(carteira.getId(), 3, true);
            }
        }
    }
}
