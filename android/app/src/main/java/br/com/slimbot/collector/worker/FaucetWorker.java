package br.com.slimbot.collector.worker;

import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.util.Log;

import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import br.com.slimbot.collector.repository.CarteiraRepository;
import br.com.slimbot.collector.repository.ConfiguracaoRepository;
import br.com.slimbot.collector.repository.ExecucaoFaucetRepository;
import br.com.slimbot.collector.repository.FaucetRepository;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.model.ExecucaoFaucet;
import br.com.slimbot.collector.repository.projection.FaucetProjection;
import br.com.slimbot.collector.service.FaucetCollector;
import br.com.slimbot.collector.vo.ResultadoColetasVO;
import br.com.slimbot.collector.vo.ResultsCollectorVO;

public class FaucetWorker implements Runnable {

    private final static String LOG_TAG = "FaucetWorker";
    private final String dbPath;
    private final DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter;
    private Configuracao configuracao;

    public FaucetWorker(String dbPath, DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter) {
        this.dbPath = dbPath;
        this.eventEmitter = eventEmitter;
    }

    @Override
    public void run() {

        Log.i(LOG_TAG, "Checando existência do banco de dados:" + this.dbPath);

        if (checkDataBase()) {
            Log.i(LOG_TAG, "Banco de dados existe. Continuando");

            Configuracao modeloConfiguracao = new ConfiguracaoRepository(this.dbPath).obterConfiguracao();

            if (modeloConfiguracao == null) {
                Log.w(LOG_TAG, "Não foi possível iniciar o worker. Motivo: configuração inexistente");
                return;
            }

            this.configuracao = modeloConfiguracao;

            Log.i(LOG_TAG, "Trabalhando com a configuração de usuário: " + modeloConfiguracao.getDescricao());

            CarteiraRepository carteiraRepository = new CarteiraRepository(this.dbPath);

            int quantidadeCarteirasAtivas = carteiraRepository.contarCarteirasAtivas();

            Log.i(LOG_TAG, "Total de carteiras ativas: " + quantidadeCarteirasAtivas);

            if (quantidadeCarteirasAtivas > 0) {
                this.iniciarWorker();
            }
        }
    }

    private void iniciarWorker() {

        while (true) {

            try {

                List<FaucetProjection> faucetsExecutar = new ArrayList<>();
                Date dataAtual = new Date();
                FaucetRepository faucetRepository = new FaucetRepository(this.dbPath);
                List<FaucetProjection> faucetsSalvos = faucetRepository.obterFaucetExecucao();


                for (FaucetProjection faucetProjection : faucetsSalvos) {
                    if (faucetProjection.getDataExecucao().before(dataAtual)) {
                        faucetsExecutar.add(faucetProjection);
                    }
                }

                Log.i(LOG_TAG, "Número de faucets a executar: " + faucetsExecutar.size());

                for (FaucetProjection faucetProjection : faucetsExecutar) {
                    try {
                        ResultadoColetasVO resultadoColetasVO = new FaucetCollector(faucetProjection, configuracao).executarColeta();

                        Log.i(LOG_TAG, "Atualizando dados do Faucet: " + faucetProjection.getCarteira());

                        if (resultadoColetasVO.getResultados() != null && resultadoColetasVO.getResultados().size() > 0) {

                            ExecucaoFaucetRepository execucaoFaucetRepository = new ExecucaoFaucetRepository(dbPath);

                            for (ResultsCollectorVO resultado : resultadoColetasVO.getResultados()) {

                                ExecucaoFaucet execucaoFaucet = new ExecucaoFaucet();
                                execucaoFaucet.setCodigoFaucet(faucetProjection.getCodigoFaucet());
                                execucaoFaucet.setValorRoll(resultado.getCoinsGanhos().doubleValue());
                                execucaoFaucet.setDataExecucaoDt(new Date());

                                execucaoFaucetRepository.salvarExecucaoFaucet(execucaoFaucet);
                            }

                        }
                        faucetRepository.atualizarFaucet(faucetProjection.getCodigoFaucet(), resultadoColetasVO.getTimeout(), resultadoColetasVO.getValorBalanco());

                        WritableNativeArray params = new WritableNativeArray();
                        params.pushInt(faucetProjection.getCodigoFaucet());

                        eventEmitter.emit("onFaucetAtualizado", params);

                    } catch (Exception ex) {

                        Log.e(LOG_TAG, "Erro executando faucet: " + faucetProjection.getCarteira(), ex);
                    }
                }
            } catch (Exception ex) {

                ex.printStackTrace();
            }

            Log.e(LOG_TAG, "Processo de Coleta concluído");

            Long proximaExecucao = this.obterProximaExecucao();

            Log.e(LOG_TAG, String.format("Aguardando %s segundos para iniciar novamente", proximaExecucao / 1000L));

            sleep(proximaExecucao);
        }
    }

    private Long obterProximaExecucao() {

        Date dataExecucao = new FaucetRepository(this.dbPath).obterTempoExecucao();

        Date dataAtual = new Date();

        if (dataExecucao.before(dataAtual)) {
            return 0L;
        }

        return dataExecucao.getTime() - dataAtual.getTime();
    }

    private void sleep(long mils) {
        try {
            Thread.sleep(mils);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private boolean checkDataBase() {
        SQLiteDatabase checkDB = null;
        try {
            checkDB = SQLiteDatabase.openDatabase(this.dbPath, null, SQLiteDatabase.OPEN_READONLY);
            checkDB.close();
        } catch (SQLiteException e) {

        }
        return checkDB != null;
    }

}
