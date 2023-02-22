package br.com.slimbot.collector;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import androidx.annotation.NonNull;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;

import javax.annotation.Nonnull;

import br.com.slimbot.collector.util.CookieStorage;

public class CollectorModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "Collector";
    private final ReactApplicationContext reactContext;

    public CollectorModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void startService() {

        defineLocalStorage();

        Intent intent = new Intent(this.reactContext, CollectorService.class);
        intent.putExtra("dbPath", getPastaSqlite().getAbsolutePath());

        this.reactContext.startService(intent);
    }


    @ReactMethod
    public void verificarCadastro() {
        defineLocalStorage();

        new Thread(new CadastroRunnable(getPastaSqlite())).start();
    }

    @ReactMethod
    public void autorizarCadastro(int codigoCarteira, String url) {
        defineLocalStorage();

        new AutorizacaoService(getPastaSqlite(), codigoCarteira, url).authorize();
    }

    @ReactMethod
    public void stopService() {
        this.reactContext.stopService(new Intent(this.reactContext, CollectorService.class));
    }

    @NonNull
    private File getPastaSqlite() {
        return new File(this.reactContext.getFilesDir().getAbsolutePath() + File.separator + "SQLite", "collector.db");
    }

    @NonNull
    private void defineLocalStorage() {
        File pastaArquivos = getPastaSqlite().getParentFile().getParentFile();

        CookieStorage.defineLocalPath(pastaArquivos);
    }
}
    

