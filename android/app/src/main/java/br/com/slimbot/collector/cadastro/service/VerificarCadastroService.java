package br.com.slimbot.collector.cadastro.service;

import android.os.Build;
import android.util.Log;

import org.json.JSONException;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import br.com.slimbot.collector.cadastro.service.intercom.CaptchaApiClient;
import br.com.slimbot.collector.cadastro.service.intercom.FaucetApiClient;
import br.com.slimbot.collector.cadastro.vo.CaptchaPropsVO;
import br.com.slimbot.collector.cadastro.vo.DadosPaginaVO;
import br.com.slimbot.collector.repository.CarteiraRepository;
import br.com.slimbot.collector.repository.ConfiguracaoRepository;
import br.com.slimbot.collector.repository.FaucetRepository;
import br.com.slimbot.collector.repository.model.Carteira;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.model.Faucet;

public class VerificarCadastroService {
    private static final String LOG_TAG = "FauVerificCadastroSer.";
    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);
    private final CarteiraRepository carteiraRepository;
    private final FaucetRepository faucetRepository;
    private final ConfiguracaoRepository configuracaoRepository;
    private final FaucetApiClient faucetApiClient = new FaucetApiClient();
    private final CaptchaApiClient captchaApiClient = new CaptchaApiClient();

    public VerificarCadastroService(String dbPath) {
        this.carteiraRepository = new CarteiraRepository(dbPath);
        this.faucetRepository = new FaucetRepository(dbPath);
        this.configuracaoRepository = new ConfiguracaoRepository(dbPath);

    }

    public void execute() {

        List<Carteira> carteiras = carteiraRepository.obterCarteiras();
        Configuracao configuracao = configuracaoRepository.obterConfiguracao();

        for (Carteira carteira : carteiras) {
            verificarCadastro(carteira, configuracao);
        }
    }

    public void execute(Integer codigoCarteira) {

        Configuracao configuracao = configuracaoRepository.obterConfiguracao();

        verificarCadastro(carteiraRepository.obterPorId(codigoCarteira), configuracao);
    }


    private void verificarCadastro(Carteira carteira, Configuracao configuracao) {
        Log.i(LOG_TAG, "Verificando cadastro da carteira: " + carteira.getDescricao());

        Faucet faucet = faucetRepository.obterFaucetPorCarteira(carteira.getId());

        if (faucet == null) {

            faucet = new Faucet();
            faucet.setProximaExecucao(sdf.format(new Date()));
            faucet.setCodigoCarteira(carteira.getId());
            faucet.setSaldoAtual(0d);
            faucet.setCodigoUsuario(configuracao.getId());

            faucet.setId(faucetRepository.salvarFaucet(faucet));
        }


        try {

            DadosPaginaVO dadosPaginaVO = faucetApiClient.getCadastroPage(carteira.getHost(), faucet.getId(), carteira.getRefer());

            String tokenId = captchaApiClient.resolverCaptcha(new CaptchaPropsVO(carteira.getHost(), dadosPaginaVO.getSiteKey(), configuracao.getCaptchaHost()));

            int codigoRegistro = faucetApiClient.register(carteira.getHost(), faucet.getId(), configuracao.getEmail(), configuracao.getSenha(), dadosPaginaVO.getCrsfToken(), tokenId);

            Log.i(LOG_TAG, "Retorno do registro da carteira: " + carteira.getDescricao() + ": " + codigoRegistro);

            if (codigoRegistro != 0) {

                dadosPaginaVO = faucetApiClient.obterDadosPagina(carteira.getHost(), faucet.getId());

                while (!dadosPaginaVO.isLogged()) {

                    tokenId = captchaApiClient.resolverCaptcha(new CaptchaPropsVO(carteira.getHost(), dadosPaginaVO.getSiteKey(), configuracao.getCaptchaHost()));

                    faucetApiClient.efetuarLogin(dadosPaginaVO, carteira.getHost(), faucet.getId(), tokenId, configuracao.getEmail(), configuracao.getSenha());

                    dadosPaginaVO = faucetApiClient.obterDadosPagina(carteira.getHost(), faucet.getId());
                }

                if (dadosPaginaVO.isEmailValid()) {

                    carteiraRepository.atualizarSituacaoCarteira(carteira.getId(), 3, true);
                } else {

                    carteiraRepository.atualizarSituacaoCarteira(carteira.getId(), 2, false);
                }

            }


        } catch (IOException | JSONException e) {
            throw new RuntimeException(e);
        }

        Log.i(LOG_TAG, "Verificação de cadastro da carteira: " + carteira.getDescricao() + " concluída!");

    }
}
