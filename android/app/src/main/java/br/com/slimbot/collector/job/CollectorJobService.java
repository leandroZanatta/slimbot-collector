package br.com.slimbot.collector.job;

import android.app.job.JobParameters;
import android.app.job.JobService;
import android.os.AsyncTask;
import android.os.PersistableBundle;
import android.util.Log;

import br.com.slimbot.collector.job.service.CollectorGroupService;
import br.com.slimbot.collector.job.service.DatabaseCheckService;

public class CollectorJobService extends JobService {

    private static final String TAG = CollectorJobService.class.getSimpleName();
    private CollectorAsyncTask collectorAsyncTask;
    private JobParameters parametros;

    @Override
    public boolean onStartJob(JobParameters params) {
        this.parametros = params;
        PersistableBundle bundle = params.getExtras();

        collectorAsyncTask = new CollectorAsyncTask();
        collectorAsyncTask.doInBackground(bundle.getString("dbLocation"));

        return true;
    }

    @Override
    public boolean onStopJob(JobParameters params) {
        Log.d(TAG, "onStopJob() was called");

        if (null != collectorAsyncTask && !collectorAsyncTask.isCancelled()) {

            collectorAsyncTask.cancel(true);
        }
        return false;
    }


    private class CollectorAsyncTask extends AsyncTask<String, Integer, String> {

        private DatabaseCheckService databaseCheckService = new DatabaseCheckService();

        @Override
        protected String doInBackground(String... strings) {

            if (!databaseCheckService.checkDataBase(strings[0])) {

                return "Banco de dados Não encontrado";
            }

            new CollectorGroupService(strings[0], faucet -> publishProgress(faucet.getId())).executarColetasPendentes();

            return "Job Concluido";
        }

        @Override
        protected void onProgressUpdate(Integer... values) {
            super.onProgressUpdate(values);
        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);

            jobFinished(parametros, true);
        }
    }

}