package br.com.slimbot.collector;

import android.app.job.JobInfo;
import android.app.job.JobScheduler;
import android.content.ComponentName;
import android.content.Context;
import android.os.PersistableBundle;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

import javax.annotation.Nonnull;

import br.com.slimbot.collector.job.CollectorJobService;
import br.com.slimbot.collector.util.CookieStorage;

public class CollectorModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "Collector";
    public static final int COLLECTOR_JOB_KEY = 5542;
    private final ReactApplicationContext reactContext;

    public CollectorModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);

        this.reactContext = reactContext;

        this.startJobService(reactContext);
    }

    private void startJobService(Context context) {

        defineLocalStorage();

        ComponentName serviceComponent = new ComponentName(context, CollectorJobService.class);

        PersistableBundle bundle = new PersistableBundle();
        bundle.getString("dbLocation", getPastaSqlite().getAbsolutePath());

        JobInfo.Builder builder = new JobInfo.Builder(COLLECTOR_JOB_KEY, serviceComponent)
                .setExtras(bundle).setPersisted(true).setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY).setPeriodic(15 * 60 * 1000);

        JobScheduler jobScheduler = (JobScheduler) context.getSystemService(context.JOB_SCHEDULER_SERVICE);

        jobScheduler.schedule(builder.build());
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
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

    @NonNull
    private File getPastaSqlite() {

        return new File(this.reactContext.getFilesDir().getAbsolutePath() + File.separator + "SQLite", "collector.db");
    }

    @NonNull
    private void defineLocalStorage() {
        File pastaArquivos =new File(this.reactContext.getFilesDir().getAbsolutePath() );

        CookieStorage.defineLocalPath(pastaArquivos);
    }
}
    

