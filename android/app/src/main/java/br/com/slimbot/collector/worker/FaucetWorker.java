package br.com.slimbot.collector.worker;

import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.util.Log;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import br.com.slimbot.collector.repository.ConfiguracaoRepository;
import br.com.slimbot.collector.repository.FaucetRepository;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.model.Faucet;
import br.com.slimbot.collector.service.FaucetCollector;
import okhttp3.OkHttpClient;

public class FaucetWorker implements Runnable {

    private final static String LOG_TAG = "FaucetWorker";
    private final String dbPath;
    private Configuracao configuracao;
    private OkHttpClient client = new OkHttpClient().newBuilder().build();

    public FaucetWorker(String dbPath) {
        this.dbPath = dbPath;
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

            this.iniciarWorker();
        }
    }

    private void iniciarWorker() {

        while (true) {

            try {

                List<Faucet> faucetsExecutar = new ArrayList<>();
                Date dataAtual = new Date();
                List<Faucet> faucetsSalvos = new FaucetRepository(this.dbPath).obterFaucetExecucao();

                for (Faucet faucet : faucetsSalvos) {
                    if (faucet.getDataExecucao().after(dataAtual)) {
                        faucetsExecutar.add(faucet);
                    }
                }

                Log.i(LOG_TAG, "Número de faucets a executar: " + faucetsExecutar.size());

                for (Faucet faucet : faucetsSalvos) {

                    new FaucetCollector(faucet, configuracao).executarColeta();
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }

            sleep(5 * 60 * 1000L);
        }
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
            checkDB = SQLiteDatabase.openDatabase(this.dbPath, null,
                    SQLiteDatabase.OPEN_READONLY);
            checkDB.close();
        } catch (SQLiteException e) {

        }
        return checkDB != null;
    }

}
