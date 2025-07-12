package com.primegeneration;

import android.app.Activity;
import android.view.View;
import android.view.WindowManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AppUtilsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public AppUtilsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "AppUtils";
    }

    @ReactMethod
    public void lockScreen() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                activity.getWindow().addFlags(
                    WindowManager.LayoutParams.FLAG_SECURE |
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                );
            });
        }
    }

    @ReactMethod
    public void unlockScreen() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                activity.getWindow().clearFlags(
                    WindowManager.LayoutParams.FLAG_SECURE |
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                );
            });
        }
    }

    @ReactMethod
    public void enableImmersiveMode() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                View decorView = activity.getWindow().getDecorView();
                decorView.setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                    View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                    View.SYSTEM_UI_FLAG_FULLSCREEN
                );
                
                activity.getWindow().addFlags(
                    WindowManager.LayoutParams.FLAG_FULLSCREEN
                );
            });
        }
    }

    @ReactMethod
    public void disableImmersiveMode() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                View decorView = activity.getWindow().getDecorView();
                decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
                
                activity.getWindow().clearFlags(
                    WindowManager.LayoutParams.FLAG_FULLSCREEN
                );
            });
        }
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }
}