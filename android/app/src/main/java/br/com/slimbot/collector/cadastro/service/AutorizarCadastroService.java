package br.com.slimbot.collector.cadastro.service;

import android.util.Log;

import org.json.JSONException;

import java.io.IOException;

import br.com.slimbot.collector.cadastro.service.intercom.CaptchaApiClient;
import br.com.slimbot.collector.cadastro.service.intercom.FaucetApiClient;
import br.com.slimbot.collector.cadastro.vo.CaptchaPropsVO;
import br.com.slimbot.collector.cadastro.vo.DadosPaginaVO;
import br.com.slimbot.collector.cadastro.vo.FaucetAuthorizationVO;
import br.com.slimbot.collector.repository.CarteiraRepository;
import br.com.slimbot.collector.repository.ConfiguracaoRepository;
import br.com.slimbot.collector.repository.FaucetRepository;
import br.com.slimbot.collector.repository.model.Carteira;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.model.Faucet;

public class AutorizarCadastroService {

    private static final String TAG = "AutorizarCadastroSer.";

    private final Integer codigoCarteira;
    private final String urlAutorizacao;
    private final CarteiraRepository carteiraRepository;
    private final FaucetRepository faucetRepository;
    private final ConfiguracaoRepository configuracaoRepository;
    private final FaucetApiClient faucetApiClient = new FaucetApiClient();
    private final CaptchaApiClient captchaApiClient = new CaptchaApiClient();

    public AutorizarCadastroService(String dbPath, Integer codigoCarteira, String urlAutorizacao) {
        this.codigoCarteira = codigoCarteira;
        this.urlAutorizacao = urlAutorizacao;
        this.carteiraRepository = new CarteiraRepository(dbPath);
        this.faucetRepository = new FaucetRepository(dbPath);
        this.configuracaoRepository = new ConfiguracaoRepository(dbPath);
    }

    public void execute() {
        Log.d(TAG, "execute");

        Carteira carteira = carteiraRepository.obterPorId(this.codigoCarteira);

        Log.d(TAG, String.format("execute => Carteira: %s - Situação: %s", carteira.getDescricao(), carteira.getSituacao()));

        if (carteira.getSituacao() != 2) {
            Log.d(TAG, "execute => Carteira não está na situação 'AGUARDANDO_VALIDAÇÃO'");

            return;
        }

        Faucet faucet = faucetRepository.obterFaucetPorCarteira(this.codigoCarteira);

        if (faucet == null) {
            Log.d(TAG, "execute => Não foi encotrado faucet para a carteira");

            return;
        }

        try {

            Configuracao configuracao = configuracaoRepository.obterConfiguracao();

            DadosPaginaVO dadosPaginaVO = faucetApiClient.obterDadosPagina(carteira.getHost(), faucet.getId());

            while (!dadosPaginaVO.isLogged()) {

                CaptchaPropsVO captchaPropsVO = new CaptchaPropsVO(carteira.getHost(), dadosPaginaVO.getSiteKey(), configuracao.getCaptchaHost());

                faucetApiClient.efetuarLogin(dadosPaginaVO, carteira.getHost(), faucet.getId(), captchaApiClient.resolverCaptcha(captchaPropsVO), configuracao.getEmail(), configuracao.getSenha());

                dadosPaginaVO = this.faucetApiClient.obterDadosPagina(carteira.getHost(), faucet.getId());
            }

            if (!dadosPaginaVO.isEmailValid()) {

                FaucetAuthorizationVO faucetAuthorizationVO = new FaucetAuthorizationVO();
                faucetAuthorizationVO.setCodigoFaucet(faucet.getId());
                faucetAuthorizationVO.setHost(carteira.getHost());
                faucetAuthorizationVO.setUrlAutorizacao(this.urlAutorizacao);

                dadosPaginaVO = faucetApiClient.autorizar(faucetAuthorizationVO);

                if (dadosPaginaVO.isEmailValid()) {

                    carteiraRepository.atualizarSituacaoCarteira(carteira.getId(), 3, true);
                }
            }
        } catch (IOException | JSONException e) {

            return;
        }

    }
}
