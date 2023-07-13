package br.com.slimbot.collector.job.service;

import android.util.Log;

import org.json.JSONException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import br.com.slimbot.collector.job.service.intercomm.CaptchaApiClient;
import br.com.slimbot.collector.job.service.intercomm.FaucetApiClient;
import br.com.slimbot.collector.job.vo.CaptchaPropsVO;
import br.com.slimbot.collector.job.vo.DadosPaginaVO;
import br.com.slimbot.collector.job.vo.ResultadoColetasVO;
import br.com.slimbot.collector.job.vo.ResultsCollectorVO;
import br.com.slimbot.collector.repository.ExecucaoFaucetRepository;
import br.com.slimbot.collector.repository.FaucetRepository;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.model.ExecucaoFaucet;
import br.com.slimbot.collector.repository.projection.FaucetProjection;


public class FaucetCollector {
    private final static String LOG_TAG = "FaucetCollector";
    private final FaucetProjection faucetProjection;
    private final Configuracao configuracao;
    private final FaucetApiClient faucetApiClient;
    private final CaptchaApiClient captchaApiClient = new CaptchaApiClient();
    private final ExecucaoFaucetRepository execucaoFaucetRepository;
    private final FaucetRepository faucetRepository;

    public FaucetCollector(String dbPath, FaucetProjection faucetProjection, Configuracao configuracao) {
        this.faucetProjection = faucetProjection;
        this.configuracao = configuracao;
        this.faucetApiClient = new FaucetApiClient(faucetProjection.getHost(), faucetProjection.getCodigoFaucet());
        this.faucetRepository = new FaucetRepository(dbPath);
        this.execucaoFaucetRepository = new ExecucaoFaucetRepository(dbPath);
    }


    public Date doCollect() {

        Date dataProximaExecucao = this.faucetProjection.getDataExecucao();

        if (this.faucetProjection.getDataExecucao().before(new Date())) {

            try {

                ResultadoColetasVO resultadoColetasVO = executarColeta();

                Log.i(LOG_TAG, "Atualizando dados do Faucet: " + this.faucetProjection.getCarteira());

                if (resultadoColetasVO.getResultados() != null && resultadoColetasVO.getResultados().size() > 0) {

                    for (ResultsCollectorVO resultado : resultadoColetasVO.getResultados()) {
                        Log.i(LOG_TAG, String.format("Resultado da coleta: %s", resultado.toString()));

                        ExecucaoFaucet execucaoFaucet = new ExecucaoFaucet();
                        execucaoFaucet.setCodigoFaucet(this.faucetProjection.getCodigoFaucet());
                        execucaoFaucet.setValorRoll(resultado.getCoinsGanhos().doubleValue());
                        execucaoFaucet.setDataExecucaoDt(new Date());

                        execucaoFaucetRepository.salvarExecucaoFaucet(execucaoFaucet);
                    }
                }
                faucetRepository.atualizarFaucet(this.faucetProjection.getCodigoFaucet(), resultadoColetasVO.getTimeout(), resultadoColetasVO.getValorBalanco());

                dataProximaExecucao = new Date(new Date().getTime() + (resultadoColetasVO.getTimeout() * 1000L));

                Log.e(LOG_TAG, String.format("Próxima coleta do faucet %s: %s", this.faucetProjection.getCarteira(), dataProximaExecucao));

            } catch (Exception ex) {

                Log.e(LOG_TAG, "Erro executando faucet: " + this.faucetProjection.getCarteira(), ex);
            }
        }

        return dataProximaExecucao;
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
                token = captchaApiClient.resolverCaptcha(new CaptchaPropsVO(faucetProjection.getHost(), dadosPaginaVO.getSiteKey(), configuracao.getCaptchaHost()));
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

            faucetApiClient.efetuarLogin(dadosPagina, captchaApiClient.resolverCaptcha(captchaPropsVO), faucetProjection.getEmail(), faucetProjection.getSenha());

            dadosPagina = this.faucetApiClient.obterDadosPagina();
        }

        Log.i(LOG_TAG, "Dados da página obtidos");

        return dadosPagina;
    }
}
