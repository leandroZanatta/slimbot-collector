package br.com.slimbot.collector;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import javax.annotation.Nullable;

public class CollectorEventService extends HeadlessJsTaskService {

    @Nullable
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        return new HeadlessJsTaskConfig(
                "SlimbotCollector",
                extras != null ? Arguments.fromBundle(extras) : Arguments.createMap(),
                5000,
                true);
    }
}
