package br.com.slimbot.collector.job;

import android.app.job.JobParameters;
import android.app.job.JobService;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;

import br.com.slimbot.collector.job.service.CollectorGroupService;
import br.com.slimbot.collector.job.service.DatabaseCheckService;
import br.com.slimbot.collector.util.CookieStorage;

public class CollectorJobService extends JobService {

    private static final String TAG = "FaucetCollectorJobServ.";
    private CollectorAsyncTask collectorAsyncTask;
    private JobParameters parametros;


    @Override
    public boolean onStartJob(JobParameters params) {
        Log.d(TAG, "onStartJob => Iniciando Job de coleta");

        this.parametros = params;

        try {
            CookieStorage.defineLocalPath(new File(this.getApplicationContext().getFilesDir().getAbsolutePath()));

            File pastaSqlite = new File(this.getApplicationContext().getFilesDir().getAbsolutePath() + File.separator + "SQLite", "collector.db");

            Log.d(TAG, "onStartJob => Bundle Param: " + pastaSqlite.getAbsolutePath());

            ReactApplication reactApplication = ((ReactApplication) getApplication());
            ReactInstanceManager reactInstanceManager = reactApplication.getReactNativeHost().getReactInstanceManager();

            collectorAsyncTask = new CollectorAsyncTask(reactInstanceManager.getCurrentReactContext());
            collectorAsyncTask.execute(pastaSqlite.getAbsolutePath());

            return true;

        } catch (Exception e) {
            Log.e(TAG, "Erro ao iniciar Job de coleta", e);

            return true;
        }
    }

    @Override
    public boolean onStopJob(JobParameters params) {
        Log.d(TAG, "onStopJob => Parando Job de coleta");

        if (null != collectorAsyncTask && !collectorAsyncTask.isCancelled()) {

            collectorAsyncTask.cancel(true);
        }

        return false;
    }

    private class CollectorAsyncTask extends AsyncTask<String, Integer, String> {
        private final DatabaseCheckService databaseCheckService = new DatabaseCheckService();
        private final ReactContext context;

        public CollectorAsyncTask(ReactContext context) {
            this.context = context;
        }

        @Override
        protected String doInBackground(String... strings) {
            try {
                Log.d(TAG, "doInBackground => Executando coleta no background");

                if (!databaseCheckService.checkDataBase(strings[0])) {

                    return "Banco de dados Não encontrado";
                }

                ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
                NetworkInfo activeNetwork = cm.getActiveNetworkInfo();

                boolean isConnected = activeNetwork != null && activeNetwork.isConnectedOrConnecting();
                if (isConnected) {
                    new CollectorGroupService(strings[0], codigoFaucet -> publishProgress(codigoFaucet)).executarColetasPendentes();
                } else {
                    Log.i(TAG, "doInBackground => Não foi identificada uma conexao de rede para executar o serviço");
                }

                return "Job Concluido";

            } catch (Exception e) {
                e.printStackTrace();
                return "Erro durante a execução do serviço";
            }
        }

        @Override
        protected void onProgressUpdate(Integer... values) {
            super.onProgressUpdate(values);

            try {

                if (context != null) {

                    WritableMap params = Arguments.createMap();
                    params.putInt("faucetId", values[0]);

                    DeviceEventManagerModule.RCTDeviceEventEmitter emitter = context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

                    emitter.emit("faucetCollected", params);
                } else {
                    Log.d(TAG, "onProgressUpdate => Contexto react é nullo, sem emissão de evento");
                }

            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);

            Log.d(TAG, "onPostExecute => Processo de coleta no background concluído");


            jobFinished(parametros, true);
        }
    }
}