package br.com.slimbot.collector.register.service;

import android.util.Log;

import androidx.annotation.NonNull;

import br.com.slimbot.collector.register.service.vo.DadosPaginaRegistroVO;
import br.com.slimbot.collector.repository.model.Carteira;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.vo.CaptchaPropsVO;
import br.com.slimbot.collector.vo.DadosPaginaVO;

public class FaucetRegisterService {

    private final static String LOG_TAG = "FaucetRegisterService";
    private final Carteira carteira;
    private final Configuracao configuracao;
    private final FaucetApiClient faucetApiClient;
    private final CaptchaService captchaService = new CaptchaService();
    private final String host;

    public FaucetRegisterService(Carteira carteira, int codigoFaucet, Configuracao configuracao) {
        this.carteira = carteira;
        this.configuracao = configuracao;
        this.host = getHost(carteira);
        this.faucetApiClient = new FaucetApiClient(host, codigoFaucet);
    }

    public int verifyRegister() {

        int codigoRegistro = 0;

        try {
            DadosPaginaRegistroVO dadosPaginaVO = faucetApiClient.getCadastroPage(carteira.getRefer());

            String tokenId = captchaService.resolverCaptcha(new CaptchaPropsVO(this.host, dadosPaginaVO.getSiteKey(), configuracao.getCaptchaHost()));

            codigoRegistro = faucetApiClient.register(configuracao.getEmail(), configuracao.getSenha(), dadosPaginaVO.getCrsfToken(), tokenId);

            Log.i(LOG_TAG, "Situação Cadastro: " + codigoRegistro);

            if (codigoRegistro != 0) {

                dadosPaginaVO = faucetApiClient.obterDadosPagina();

                while (!dadosPaginaVO.isLogged()) {

                    tokenId = captchaService.resolverCaptcha(new CaptchaPropsVO(this.host, dadosPaginaVO.getSiteKey(), configuracao.getCaptchaHost()));

                    faucetApiClient.efetuarLogin(dadosPaginaVO, tokenId, configuracao.getEmail(), configuracao.getSenha());

                    dadosPaginaVO = faucetApiClient.obterDadosPagina();
                }

                if (dadosPaginaVO.isEmailValid()) {
                    codigoRegistro = 3;
                }

            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return codigoRegistro;
    }

    public DadosPaginaVO auhorize(String urlExecucao) {

        try {

            DadosPaginaVO dadosPaginaVO = faucetApiClient.obterDadosPagina();

            while (!dadosPaginaVO.isLogged()) {

                String tokenId = captchaService.resolverCaptcha(new CaptchaPropsVO(this.host, dadosPaginaVO.getSiteKey(), configuracao.getCaptchaHost()));

                faucetApiClient.efetuarLogin(dadosPaginaVO, tokenId, configuracao.getEmail(), configuracao.getSenha());

                dadosPaginaVO = faucetApiClient.obterDadosPagina();
            }

            return faucetApiClient.autorizar(urlExecucao);

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }



    @NonNull
    private String getHost(Carteira carteira) {
        return carteira.getRefer().substring(8, carteira.getRefer().lastIndexOf("/?"));
    }


}
