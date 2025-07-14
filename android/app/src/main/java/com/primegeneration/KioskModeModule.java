package com.primegeneration;

import android.app.Activity;
import android.app.ActivityManager;
import android.os.Build;
import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class KioskModeModule extends ReactContextBaseJavaModule {
    public KioskModeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "KioskMode";
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true; // TAMBAHKAN INI
    }

    @ReactMethod
    public void isKioskModeActive(Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            ActivityManager am = (ActivityManager) activity.getSystemService(Context.ACTIVITY_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                boolean isLocked = am.getLockTaskModeState() != ActivityManager.LOCK_TASK_MODE_NONE;
                promise.resolve(isLocked);
            } else {
                // Untuk Android Lollipop (API 21/22)
                promise.resolve(false); // Atau handling lain
            }
        } else {
            promise.reject("NO_ACTIVITY", "Activity not available");
        }
    }

    @ReactMethod
    public void enterKioskMode(Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                try {
                    activity.startLockTask(); // 🔐 Mulai lock task
                    promise.resolve("Kiosk mode started");
                } catch (Exception e) {
                    e.printStackTrace();
                    promise.reject("ERR_KIOSK_MODE", e.getMessage());
                }
            });
        } else {
            promise.reject("ERR_NO_ACTIVITY", "No current activity");
        }
    }

    @ReactMethod
    public void exitKioskMode() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                try {
                    activity.stopLockTask(); // 🔓 Keluar dari mode terkunci
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
    }

}