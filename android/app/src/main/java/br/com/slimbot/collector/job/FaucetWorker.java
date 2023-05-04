package br.com.slimbot.collector.job;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.BackoffPolicy;
import androidx.work.Constraints;
import androidx.work.Data;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import br.com.slimbot.collector.job.service.FaucetCollector;
import br.com.slimbot.collector.job.vo.ResultadoColetasVO;
import br.com.slimbot.collector.job.vo.ResultsCollectorVO;
import br.com.slimbot.collector.repository.ConfiguracaoRepository;
import br.com.slimbot.collector.repository.ExecucaoFaucetRepository;
import br.com.slimbot.collector.repository.FaucetRepository;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.model.ExecucaoFaucet;
import br.com.slimbot.collector.repository.projection.FaucetProjection;

public class FaucetWorker extends Worker {

    private final static String LOG_TAG = "FaucetWorker";

    private final Integer codigoFaucet;
    private final String dbPath;
    private final FaucetRepository faucetRepository;
    private final ConfiguracaoRepository configuracaoRepository;
    private final ExecucaoFaucetRepository execucaoFaucetRepository;

    public FaucetWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);

        this.codigoFaucet = getInputData().getInt("codigoFaucet", 0);
        this.dbPath = getInputData().getString("dbPath");
        this.faucetRepository = new FaucetRepository(dbPath);
        this.configuracaoRepository = new ConfiguracaoRepository(dbPath);
        this.execucaoFaucetRepository = new ExecucaoFaucetRepository(dbPath);
    }

    @Override
    public Result doWork() {
        Date nextExecution = coletarFaucet();

        if(nextExecution!=null) {
            agendarProximaExecucao(nextExecution);
        }

        return Result.success();
    }

    private void agendarProximaExecucao(Date data) {

        Constraints constraints = new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build();

        long delay = data.getTime() - System.currentTimeMillis();

        if (delay < 0) {
            delay = 0;
        }

        PeriodicWorkRequest.Builder requestBuilder =
                new PeriodicWorkRequest.Builder(FaucetWorker.class, 1, TimeUnit.HOURS)
                        .setConstraints(constraints).setBackoffCriteria(BackoffPolicy.EXPONENTIAL, OneTimeWorkRequest.MIN_BACKOFF_MILLIS, TimeUnit.MILLISECONDS)
                        .setInputData(new Data.Builder().putInt("codigoFaucet", codigoFaucet).putString("dbPath", dbPath).build())
                        .setInitialDelay(delay, TimeUnit.MILLISECONDS)
                        .addTag("faucet-worker-" + this.codigoFaucet);

        PeriodicWorkRequest request = requestBuilder.build();

        WorkManager.getInstance(getApplicationContext()).enqueue(request);
    }

    private Date coletarFaucet() {

        FaucetProjection faucet = faucetRepository.obterFaucet(this.codigoFaucet);

        if (faucet != null) {

            Date dataProximaExecucao = faucet.getDataExecucao();

            if (faucet.getDataExecucao().after(new Date())) {
                try {
                    Configuracao configuracao = configuracaoRepository.obterConfiguracao();

                    FaucetCollector faucetCollector = new FaucetCollector(faucet, configuracao);

                    ResultadoColetasVO resultadoColetasVO = faucetCollector.executarColeta();

                    Log.i(LOG_TAG, "Atualizando dados do Faucet: " + faucet.getCarteira());

                    if (resultadoColetasVO.getResultados() != null && resultadoColetasVO.getResultados().size() > 0) {

                        for (ResultsCollectorVO resultado : resultadoColetasVO.getResultados()) {

                            ExecucaoFaucet execucaoFaucet = new ExecucaoFaucet();
                            execucaoFaucet.setCodigoFaucet(faucet.getCodigoFaucet());
                            execucaoFaucet.setValorRoll(resultado.getCoinsGanhos().doubleValue());
                            execucaoFaucet.setDataExecucaoDt(new Date());

                            execucaoFaucetRepository.salvarExecucaoFaucet(execucaoFaucet);
                        }
                    }
                    faucetRepository.atualizarFaucet(faucet.getCodigoFaucet(), resultadoColetasVO.getTimeout(), resultadoColetasVO.getValorBalanco());

                    dataProximaExecucao = new Date(new Date().getTime() + resultadoColetasVO.getTimeout());

                    Log.e(LOG_TAG, String.format("Próxima coleta do faucet %s: %s", faucet.getCarteira(), dataProximaExecucao));

                } catch (Exception ex) {

                    Log.e(LOG_TAG, "Erro executando faucet: " + faucet.getCarteira(), ex);
                }
            }

            return dataProximaExecucao;
        }

        return null;
    }
}