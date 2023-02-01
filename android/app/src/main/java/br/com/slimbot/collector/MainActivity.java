package br.com.slimbot.collector;

import android.os.Build;
import android.os.Bundle;
import android.webkit.WebView;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import expo.modules.ReactActivityDelegateWrapper;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(null);
    }

    @Override
    protected String getMainComponentName() {
        return "main";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
                new MainActivityDelegate(this, getMainComponentName())
        );
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
            if (!moveTaskToBack(false)) {
                super.invokeDefaultOnBackPressed();
            }
            return;
        }

        super.invokeDefaultOnBackPressed();
    }

    public static class MainActivityDelegate extends ReactActivityDelegate {
        public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
            super(activity, mainComponentName);
        }

        @Override
        protected ReactRootView createRootView() {
            ReactRootView reactRootView = new ReactRootView(getContext());
            reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
            return reactRootView;
        }

        @Override
        protected boolean isConcurrentRootEnabled() {
            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }
    }
}
