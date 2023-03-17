package br.com.slimbot.collector;

import android.app.job.JobInfo;
import android.app.job.JobScheduler;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.PersistableBundle;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;

import javax.annotation.Nonnull;

import br.com.slimbot.collector.cadastro.CadastroIntentService;
import br.com.slimbot.collector.job.CollectorJobService;
import br.com.slimbot.collector.job.CollectorJobWatcherService;

public class CollectorModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "Collector";
    public static final int COLLECTOR_JOB_KEY = 5542;
    private static final int COLLECTOR_JOB_WATCHER_KEY = 5543;
    private static final long CHECK_COLLECTOR_JOB_INTERVAL = 60 * 60 * 1000; // 1 hora

    private final static String LOG_TAG = "FaucetCollectorModule";
    private final ReactApplicationContext reactContext;

    public CollectorModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);

        this.reactContext = reactContext;

        this.startJobService(reactContext);
    }

    private void startJobService(ReactApplicationContext context) {
        Log.i(LOG_TAG, "startJobService=> Iniciando Job Service");

        JobScheduler jobScheduler = (JobScheduler) context.getSystemService(Context.JOB_SCHEDULER_SERVICE);

        boolean jobExists = false;
        List<JobInfo> allJobs = jobScheduler.getAllPendingJobs();

        for (JobInfo jobInfo : allJobs) {
            PersistableBundle extras = jobInfo.getExtras();
            if (extras != null && extras.containsKey("JOB_UUID") && extras.getString("JOB_UUID").equals("5542")) {
                Log.i(LOG_TAG, "startJobService=> job JOB_UUID existe, não será criado schedule");

                jobExists = true;

                break;
            }
        }

        if (!jobExists) {
            Log.i(LOG_TAG, "startJobService=> CRIANDO SCHEDULE PARA O JOB DE COLETA");

            ComponentName serviceComponent = new ComponentName(context, CollectorJobService.class);

            JobInfo.Builder builder = new JobInfo.Builder(COLLECTOR_JOB_KEY, serviceComponent)
                    .setPersisted(true)
                    .setRequiredNetworkType(JobInfo.NETWORK_TYPE_UNMETERED)
                    .setPeriodic(15 * 60 * 1000);

            // adicionar a chave única como um extra
            PersistableBundle extras = new PersistableBundle();
            extras.putString("JOB_UUID", "5542");
            builder.setExtras(extras);

            jobScheduler.schedule(builder.build());
        }

        // JobScheduler que verifica se o CollectorJobService está ativo a cada hora
        boolean watcherJobExists = false;
        List<JobInfo> watcherJobs = jobScheduler.getAllPendingJobs();

        for (JobInfo jobInfo : watcherJobs) {
            if (jobInfo.getId() == COLLECTOR_JOB_WATCHER_KEY) {
                Log.i(LOG_TAG, "startJobService=> job JOB_WATCH_UUID existe, não será criado schedule");
                watcherJobExists = true;
                break;
            }
        }

        if (!watcherJobExists) {
            Log.i(LOG_TAG, "startJobService=> CRIANDO SCHEDULE PARA O JOB DE REAGENDAMENTO");
            ComponentName watcherComponent = new ComponentName(context, CollectorJobWatcherService.class);
            JobInfo.Builder watcherBuilder = new JobInfo.Builder(COLLECTOR_JOB_WATCHER_KEY, watcherComponent)
                    .setPeriodic(CHECK_COLLECTOR_JOB_INTERVAL)
                    .setPersisted(true)
                    .setRequiredNetworkType(JobInfo.NETWORK_TYPE_NONE);

            jobScheduler.schedule(watcherBuilder.build());
        }
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }


    @ReactMethod
    public void verificarCadastro() {

        Intent intent = new Intent(this.reactContext, CadastroIntentService.class);
        intent.putExtra("type", "verify");

        this.reactContext.startService(intent);
    }

    @ReactMethod
    public void autorizarCadastro(int codigoCarteira, String url) {

        Intent intent = new Intent(this.reactContext, CadastroIntentService.class);
        intent.putExtra("type", "authorize");
        intent.putExtra("carteira", codigoCarteira);
        intent.putExtra("url", url);

        this.reactContext.startService(intent);
    }
}
    

