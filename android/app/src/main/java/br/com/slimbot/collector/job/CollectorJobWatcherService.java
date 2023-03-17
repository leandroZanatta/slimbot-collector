package br.com.slimbot.collector.job;

import android.app.job.JobInfo;
import android.app.job.JobParameters;
import android.app.job.JobScheduler;
import android.app.job.JobService;
import android.content.ComponentName;
import android.content.Context;
import android.os.Build;
import android.os.PersistableBundle;
import android.util.Log;

import java.util.List;

public class CollectorJobWatcherService extends JobService {
    private static final String LOG_TAG = "CollectJobWatcherServ";
    private static final int COLLECTOR_JOB_WATCHER_KEY = 1001;
    public static final int COLLECTOR_JOB_KEY = 5542;

    @Override
    public boolean onStartJob(JobParameters params) {
        Log.i(LOG_TAG, "onStartJob=> Verificando se o CollectorJobService está sendo executado");

        JobScheduler jobScheduler = (JobScheduler) getSystemService(Context.JOB_SCHEDULER_SERVICE);

        boolean jobExists = false;
        List<JobInfo> allJobs = jobScheduler.getAllPendingJobs();

        for (JobInfo jobInfo : allJobs) {
            if (jobInfo.getId() == COLLECTOR_JOB_KEY) {
                jobExists = true;
                break;
            }
        }

        if (!jobExists) {
            Log.i(LOG_TAG, "onStartJob=> CollectorJobService não está sendo executado, criando novo schedule");

            ComponentName serviceComponent = new ComponentName(this, CollectorJobService.class);

            JobInfo.Builder builder = new JobInfo.Builder(COLLECTOR_JOB_KEY, serviceComponent)
                    .setPersisted(true)
                    .setRequiredNetworkType(JobInfo.NETWORK_TYPE_UNMETERED)
                    .setPeriodic(15 * 60 * 1000);

            PersistableBundle extras = new PersistableBundle();
            extras.putString("JOB_UUID", "5542");
            builder.setExtras(extras);

            jobScheduler.schedule(builder.build());
        }

       return true;
    }

    @Override
    public boolean onStopJob(JobParameters params) {
        return false;
    }
}