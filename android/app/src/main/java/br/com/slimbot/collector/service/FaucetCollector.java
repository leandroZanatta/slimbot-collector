package br.com.slimbot.collector.service;

import org.json.JSONException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.model.Faucet;
import br.com.slimbot.collector.vo.CaptchaPropsVO;
import br.com.slimbot.collector.vo.DadosPaginaVO;
import br.com.slimbot.collector.vo.ResultsCollectorVO;

public class FaucetCollector {

    private final Faucet faucet;
    private final Configuracao configuracao;
    private final FaucetApiClient faucetApiClient;
    private final CaptchaService captchaService = new CaptchaService();

    public FaucetCollector(Faucet faucet, Configuracao configuracao) {
        this.faucet = faucet;
        this.configuracao = configuracao;
        this.faucetApiClient = new FaucetApiClient(faucet.getHost(), faucet.getCodigoFaucet());
    }

    public void executarColeta() throws JSONException, IOException {

        DadosPaginaVO dadosPaginaVO = obterHomePage();

        if (dadosPaginaVO.getTimeOut() == 0) {
            this.executarRollsPendentes(dadosPaginaVO);
        }
    }

    private void executarRollsPendentes(DadosPaginaVO dadosPaginaVO) throws IOException, JSONException {
        List<ResultsCollectorVO> dadosColetas = new ArrayList<>();

        while (dadosPaginaVO.getNumRolls() > 0) {

            String token = "whitelist";

            if (dadosPaginaVO.isCaptcha()) {
                token = captchaService.resolverCaptcha(new CaptchaPropsVO(faucet.getHost(), dadosPaginaVO.getSiteKey(), configuracao.getCaptchaHost()));
            }

            dadosColetas.add(this.faucetApiClient.efetuarRoll(token, dadosPaginaVO));
        }
    }

    private DadosPaginaVO obterHomePage() throws IOException, JSONException {

        DadosPaginaVO dadosPagina = this.faucetApiClient.obterDadosPagina();

        while (!dadosPagina.isLogged()) {

            CaptchaPropsVO captchaPropsVO = new CaptchaPropsVO(faucet.getHost(), dadosPagina.getSiteKey(), configuracao.getCaptchaHost());

            faucetApiClient.efetuarLogin(dadosPagina, captchaService.resolverCaptcha(captchaPropsVO), configuracao.getEmail(), configuracao.getSenha());

            dadosPagina = this.faucetApiClient.obterDadosPagina();
        }

        return dadosPagina;
    }
}
