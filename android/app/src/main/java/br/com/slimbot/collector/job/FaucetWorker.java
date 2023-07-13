package br.com.slimbot.collector.job;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import br.com.slimbot.collector.MainApplication;
import br.com.slimbot.collector.job.service.FaucetCollector;
import br.com.slimbot.collector.repository.ConfiguracaoRepository;
import br.com.slimbot.collector.repository.FaucetRepository;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.projection.FaucetProjection;
import br.com.slimbot.collector.util.CookieStorage;

public class FaucetWorker extends Worker {

    private final static String LOG_TAG = "FaucetWorker";

    private final Integer codigoFaucet;
    private final String dbPath;
    private final FaucetRepository faucetRepository;
    private final ConfiguracaoRepository configuracaoRepository;

    public FaucetWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);

        this.codigoFaucet = getInputData().getInt("codigoFaucet", 0);
        this.dbPath = getInputData().getString("dbPath");
        this.faucetRepository = new FaucetRepository(dbPath);
        this.configuracaoRepository = new ConfiguracaoRepository(dbPath);
    }

    @Override
    public Result doWork() {
        return coletarFaucet();
    }


    private Result coletarFaucet() {

        try {
            CookieStorage.defineLocalPath(getApplicationContext().getFilesDir());

            FaucetProjection faucet = faucetRepository.obterFaucet(this.codigoFaucet);

            if (faucet != null) {

                Configuracao configuracao = configuracaoRepository.obterConfiguracao();

                new FaucetCollector(dbPath, faucet, configuracao).doCollect();

                ReactInstanceManager reactInstanceManager = ((MainApplication) getApplicationContext()).getReactNativeHost().getReactInstanceManager();
                ReactContext context = reactInstanceManager.getCurrentReactContext();

                if (context != null) {

                    DeviceEventManagerModule.RCTDeviceEventEmitter emitter = context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

                    WritableMap params = Arguments.createMap();

                    params.putInt("faucetId", faucet.getCodigoFaucet());

                    emitter.emit("faucetCollected", params);
                } else {
                    Log.d(LOG_TAG, "coletarFaucet => Contexto react é nullo, sem emissão de evento");
                }

                return Result.success();
            }
        }catch (Exception e){
            Log.e(LOG_TAG, "coletarFaucet => erro executando worker:",e);

            return Result.failure();
        }

        return Result.success();
    }
}