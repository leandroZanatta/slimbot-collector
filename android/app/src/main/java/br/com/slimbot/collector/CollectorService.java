package br.com.slimbot.collector;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;

import androidx.core.app.NotificationCompat;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import br.com.slimbot.collector.worker.FaucetWorker;

public class CollectorService extends Service {
    private static final int SERVICE_NOTIFICATION_ID = 54321;
    private static final String CHANNEL_ID = "Collector";
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private boolean started = false;

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Collector",
                    importance
            );
            channel.setDescription("CHANEL DESCRIPTION");
            NotificationManager notificationManager = getSystemService(
                    NotificationManager.class
            );
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        executor.shutdown();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        if (started) {
            return START_STICKY;
        }

        Bundle bundle = intent.getExtras();

        MainApplication application = (MainApplication) this.getApplication();

        ReactNativeHost reactNativeHost = application.getReactNativeHost();
        ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter = null;

        if (reactContext != null) {
            eventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }

        executor.submit(new FaucetWorker(bundle.getString("dbPath"), eventEmitter));

        createNotificationChannel();

        Intent notificationIntent = new Intent(this, MainActivity.class);

        PendingIntent contentIntent = this.createPendingIntent(notificationIntent);

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Collector")
                .setContentText("Inicializando Coletor")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(contentIntent)
                .setOngoing(true)
                .build();
        startForeground(SERVICE_NOTIFICATION_ID, notification);

        this.started = true;

        return START_STICKY;
    }

    private PendingIntent createPendingIntent(Intent intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return PendingIntent.getActivity(
                    this,
                    0,
                    intent,
                    PendingIntent.FLAG_CANCEL_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
        }

        return PendingIntent.getActivity(
                this,
                0,
                intent,
                PendingIntent.FLAG_CANCEL_CURRENT
        );
    }
}
