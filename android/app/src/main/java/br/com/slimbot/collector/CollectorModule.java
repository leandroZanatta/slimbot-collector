package br.com.slimbot.collector;

import androidx.work.BackoffPolicy;
import androidx.work.Constraints;
import androidx.work.Data;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.Nonnull;

import br.com.slimbot.collector.job.FaucetWorker;
import br.com.slimbot.collector.repository.FaucetRepository;

public class CollectorModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "Collector";
    private final ReactApplicationContext reactContext;

    public CollectorModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);

        this.reactContext = reactContext;
    }


    @ReactMethod
    public void iniciarWorker() {

        File arquivoSqlite = new File(this.reactContext.getFilesDir().getAbsolutePath() + File.separator + "SQLite", "collector.db");

        if (arquivoSqlite.exists()) {

            FaucetRepository faucetRepository = new FaucetRepository(arquivoSqlite.getAbsolutePath());

            List<Integer> faucets = faucetRepository.obterTodosFaucets();

            for (Integer codigoFaucet : faucets) {

                this.gerarWorker(codigoFaucet, arquivoSqlite.getAbsolutePath());
            }
        }
    }

    private void gerarWorker(Integer codigoFaucet, String dbPath) {

        Constraints constraints = new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build();

        PeriodicWorkRequest.Builder requestBuilder =
                new PeriodicWorkRequest.Builder(FaucetWorker.class, 1, TimeUnit.HOURS)
                        .setConstraints(constraints).setBackoffCriteria(BackoffPolicy.EXPONENTIAL, OneTimeWorkRequest.MIN_BACKOFF_MILLIS, TimeUnit.MILLISECONDS)
                        .setInputData(new Data.Builder().putInt("codigoFaucet", codigoFaucet).putString("dbPath", dbPath).build())
                        .addTag("faucet-worker-" + codigoFaucet);

        PeriodicWorkRequest request = requestBuilder.build();

        WorkManager.getInstance(this.reactContext).enqueue(request);
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

}
    

