package br.com.slimbot.collector;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class CollectorModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "SlimbotCollector";
    private static ReactApplicationContext reactContext;

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
        this.reactContext.startService(new Intent(this.reactContext, CollectorService.class));
    }

    @ReactMethod
    public void stopService() {
        this.reactContext.stopService(new Intent(this.reactContext, CollectorService.class));
    }
}
    

