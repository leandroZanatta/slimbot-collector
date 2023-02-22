package br.com.slimbot.collector.service;

import android.util.Log;

import org.json.JSONException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.projection.FaucetProjection;
import br.com.slimbot.collector.vo.CaptchaPropsVO;
import br.com.slimbot.collector.vo.DadosPaginaVO;
import br.com.slimbot.collector.vo.ResultadoColetasVO;
import br.com.slimbot.collector.vo.ResultsCollectorVO;

public class FaucetCollector {

    private final static String LOG_TAG = "FaucetCollector";
    private final FaucetProjection faucetProjection;
    private final Configuracao configuracao;
    private final FaucetApiClient faucetApiClient;
    private final CaptchaService captchaService = new CaptchaService();

    public FaucetCollector(FaucetProjection faucetProjection, Configuracao configuracao) {
        this.faucetProjection = faucetProjection;
        this.configuracao = configuracao;
        this.faucetApiClient = new FaucetApiClient(faucetProjection.getHost(), faucetProjection.getCodigoFaucet());
    }

    public ResultadoColetasVO executarColeta() throws JSONException, IOException {

        DadosPaginaVO dadosPaginaVO = obterHomePage();
        ResultadoColetasVO resultadoColetasVO = new ResultadoColetasVO();

        if (dadosPaginaVO.getTimeOut() == 0) {
            resultadoColetasVO.setResultados(this.executarRollsPendentes(dadosPaginaVO));

            if (resultadoColetasVO.getResultados().size() > 0) {

                ResultsCollectorVO result = resultadoColetasVO.getResultados().get(resultadoColetasVO.getResultados().size() - 1);

                resultadoColetasVO.setTimeout(result.getProximoRoll());
                resultadoColetasVO.setValorBalanco(result.getTotalBalanco());
            } else {
                resultadoColetasVO.setTimeout(dadosPaginaVO.getTimeOut());
                resultadoColetasVO.setValorBalanco(dadosPaginaVO.getBalance());
            }
        } else {
            resultadoColetasVO.setTimeout(dadosPaginaVO.getTimeOut());
            resultadoColetasVO.setValorBalanco(dadosPaginaVO.getBalance());
        }

        return resultadoColetasVO;

    }

    private List<ResultsCollectorVO> executarRollsPendentes(DadosPaginaVO dadosPaginaVO) throws IOException, JSONException {
        Log.i(LOG_TAG, "Executando rolls pendentes");

        List<ResultsCollectorVO> dadosColetas = new ArrayList<>();

        while (dadosPaginaVO.getNumRolls() > 0) {

            String token = "whitelist";

            if (dadosPaginaVO.isCaptcha()) {
                token = captchaService.resolverCaptcha(new CaptchaPropsVO(faucetProjection.getHost(), dadosPaginaVO.getSiteKey(), configuracao.getCaptchaHost()));
            }

            Log.i(LOG_TAG, "Executando roll");

            ResultsCollectorVO resultado = this.faucetApiClient.efetuarRoll(token, dadosPaginaVO);

            if (resultado.isStatus()) {
                dadosColetas.add(resultado);
            } else {
                return dadosColetas;
            }
        }

        return dadosColetas;
    }

    private DadosPaginaVO obterHomePage() throws IOException, JSONException {

        DadosPaginaVO dadosPagina = this.faucetApiClient.obterDadosPagina();

        Log.i(LOG_TAG, "Obtendo dados da página: " + faucetProjection.getCarteira());

        while (!dadosPagina.isLogged()) {

            CaptchaPropsVO captchaPropsVO = new CaptchaPropsVO(faucetProjection.getHost(), dadosPagina.getSiteKey(), configuracao.getCaptchaHost());

            Log.i(LOG_TAG, "Efetuando Login");

            faucetApiClient.efetuarLogin(dadosPagina, captchaService.resolverCaptcha(captchaPropsVO), configuracao.getEmail(), configuracao.getSenha());

            dadosPagina = this.faucetApiClient.obterDadosPagina();
        }

        Log.i(LOG_TAG, "Dados da página obtidos");

        return dadosPagina;
    }
}
