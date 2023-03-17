package br.com.slimbot.collector.job.service;

import android.util.Log;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import br.com.slimbot.collector.job.listener.CollectorListener;
import br.com.slimbot.collector.job.vo.ResultadoColetasVO;
import br.com.slimbot.collector.job.vo.ResultsCollectorVO;
import br.com.slimbot.collector.repository.ConfiguracaoRepository;
import br.com.slimbot.collector.repository.ExecucaoFaucetRepository;
import br.com.slimbot.collector.repository.FaucetRepository;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.model.ExecucaoFaucet;
import br.com.slimbot.collector.repository.projection.FaucetProjection;

public class CollectorGroupService {
    private final static String LOG_TAG = "CollectorGroupService";

    private final String dbPath;
    private final FaucetRepository faucetRepository;
    private final ConfiguracaoRepository configuracaoRepository;

    private final ExecucaoFaucetRepository execucaoFaucetRepository;

    private final CollectorListener collectorListener;

    public CollectorGroupService(String dbPath, CollectorListener collectorListener) {
        this.dbPath = dbPath;
        this.faucetRepository = new FaucetRepository(dbPath);
        this.configuracaoRepository = new ConfiguracaoRepository(dbPath);
        this.execucaoFaucetRepository = new ExecucaoFaucetRepository(dbPath);
        this.collectorListener = collectorListener;
    }

    public void executarColetasPendentes() {

        List<FaucetProjection> faucetsExecutar = filtrarExecucaoFaucets();

        Log.i(LOG_TAG, "Número de faucets a executar: " + faucetsExecutar.size());

        if (faucetsExecutar.size() > 0) {

            Configuracao configuracao = configuracaoRepository.obterConfiguracao();

            for (FaucetProjection faucetProjection : faucetsExecutar) {
                executarFaucetCarteira(faucetProjection, configuracao);
            }
        }

        Log.e(LOG_TAG, "Processo de Coleta concluído");
    }


    private void executarFaucetCarteira(FaucetProjection faucetProjection, Configuracao configuracao) {

        try {
            FaucetCollector faucetCollector = new FaucetCollector(faucetProjection, configuracao);

            ResultadoColetasVO resultadoColetasVO = faucetCollector.executarColeta();

            Log.i(LOG_TAG, "Atualizando dados do Faucet: " + faucetProjection.getCarteira());

            if (resultadoColetasVO.getResultados() != null && resultadoColetasVO.getResultados().size() > 0) {

                for (ResultsCollectorVO resultado : resultadoColetasVO.getResultados()) {

                    ExecucaoFaucet execucaoFaucet = new ExecucaoFaucet();
                    execucaoFaucet.setCodigoFaucet(faucetProjection.getCodigoFaucet());
                    execucaoFaucet.setValorRoll(resultado.getCoinsGanhos().doubleValue());
                    execucaoFaucet.setDataExecucaoDt(new Date());

                    execucaoFaucetRepository.salvarExecucaoFaucet(execucaoFaucet);
                }
            }

            faucetRepository.atualizarFaucet(faucetProjection.getCodigoFaucet(), resultadoColetasVO.getTimeout(), resultadoColetasVO.getValorBalanco());

            collectorListener.onFaucetCollected(faucetProjection.getCodigoFaucet());

        } catch (Exception ex) {

            Log.e(LOG_TAG, "Erro executando faucet: " + faucetProjection.getCarteira(), ex);
        }

    }

    private List<FaucetProjection> filtrarExecucaoFaucets() {

        List<FaucetProjection> faucetsExecutar = new ArrayList<>();

        Date dataAtual = new Date();

        List<FaucetProjection> faucetsSalvos = faucetRepository.obterFaucetExecucao();

        for (FaucetProjection faucetProjection : faucetsSalvos) {
            if (faucetProjection.getDataExecucao().before(dataAtual)) {
                faucetsExecutar.add(faucetProjection);
            }
        }

        return faucetsExecutar;
    }
}
