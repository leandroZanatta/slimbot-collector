package br.com.slimbot.collector;

import android.content.Intent;
import android.webkit.WebView;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

import javax.annotation.Nonnull;

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
        File pastaSqlite=  new File( this.reactContext.getFilesDir().getAbsolutePath()+File.separator+"SQLite","app5.db");

        Intent intent=     new Intent(this.reactContext, CollectorService.class);
        intent.putExtra("dbPath",pastaSqlite.getAbsolutePath());

        this.reactContext.startService(intent);
    }

    @ReactMethod
    public void stopService() {
        this.reactContext.stopService(new Intent(this.reactContext, CollectorService.class));
    }
}
    

