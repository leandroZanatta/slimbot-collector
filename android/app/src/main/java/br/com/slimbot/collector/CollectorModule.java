package br.com.slimbot.collector;

import androidx.work.Constraints;
import androidx.work.Data;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.Nonnull;

import br.com.slimbot.collector.job.FaucetWorker;
import br.com.slimbot.collector.job.service.FaucetCollector;
import br.com.slimbot.collector.repository.ConfiguracaoRepository;
import br.com.slimbot.collector.repository.FaucetRepository;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.projection.FaucetProjection;
import br.com.slimbot.collector.util.CookieStorage;

public class CollectorModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "Collector";

    private final ReactApplicationContext reactContext;

    public CollectorModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        CookieStorage.defineLocalPath(reactContext.getFilesDir());
    }

    @ReactMethod
    public void iniciarWorker() {

        File arquivoSqlite = new File(getDbPath());

        if (arquivoSqlite.exists()) {
            FaucetRepository faucetRepository = new FaucetRepository(
                    arquivoSqlite.getAbsolutePath()
            );

            List<FaucetProjection> faucets = faucetRepository.obterFaucetExecucao();

            for (FaucetProjection faucet : faucets) {
                this.gerarWorker(faucet, arquivoSqlite.getAbsolutePath());
            }
        }
    }

    private String getDbPath() {
        return (
                this.reactContext.getFilesDir().getAbsolutePath() +
                        File.separator +
                        "SQLite" +
                        File.separator +
                        "collector.db"
        );
    }

    @ReactMethod
    public void buscarCookie(Integer codigoFaucet, Promise promise) {
        Collection<String> mapaCookies = CookieStorage
                .getCookiesStorage(codigoFaucet)
                .values();

        WritableArray array = Arguments.createArray();

        for (String item : mapaCookies) {
            array.pushString(item);
        }

        promise.resolve(array);
    }

    @ReactMethod
    public void limparCookies() {
        CookieStorage.clearCookiesStorage();
    }

    @ReactMethod
    public void salvarCookie(Integer codigoFaucet, ReadableArray cookies) {
        List<String> cookieList = new ArrayList<>();

        for (int i = 0; i < cookies.size(); i++) {
            String cookie = cookies.getString(i);
            cookieList.add(cookie);
        }

        CookieStorage.setCookiesStorage(codigoFaucet, cookieList);
    }

    @ReactMethod
    public void forcarSincronizacao() {
        new Thread(() -> {
            String dbPath = getDbPath();

            List<FaucetProjection> faucets = new FaucetRepository(dbPath)
                    .obterFaucetExecucao();
            Configuracao configuracao = new ConfiguracaoRepository(dbPath)
                    .obterConfiguracao();

            for (FaucetProjection faucet : faucets) {
                try {

                    new FaucetCollector(dbPath, faucet, configuracao).doCollect();

                    DeviceEventManagerModule.RCTDeviceEventEmitter emitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

                    WritableMap params = Arguments.createMap();

                    params.putInt("faucetId", faucet.getCodigoFaucet());

                    emitter.emit("faucetCollected", params);

                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        })
                .start();
    }

    private void gerarWorker(FaucetProjection faucet, String dbPath) {
        String workerTag = "faucet-worker-" + faucet.getCodigoFaucet();

        long delay = faucet.getDataExecucao().getTime() - System.currentTimeMillis();

        if (delay < 0) {
            delay = 0;
        }

        Constraints constraints = new Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build();

        PeriodicWorkRequest.Builder requestBuilder = new PeriodicWorkRequest.Builder(FaucetWorker.class, 15, TimeUnit.MINUTES)
                .setConstraints(constraints).setInputData(new Data.Builder().putInt("codigoFaucet", faucet.getCodigoFaucet()).putString("dbPath", dbPath).build())
                .setInitialDelay(delay, TimeUnit.MILLISECONDS).addTag(workerTag);

        WorkManager.getInstance(this.reactContext)
                .enqueueUniquePeriodicWork(workerTag, ExistingPeriodicWorkPolicy.KEEP, requestBuilder.build());
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }
}
