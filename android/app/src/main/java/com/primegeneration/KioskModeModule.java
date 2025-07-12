package com.primegeneration;

import android.app.Activity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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
public void enterKioskMode() {
    Activity activity = getCurrentActivity();
    if (activity != null) {
        activity.runOnUiThread(() -> {
            try {
                activity.startLockTask(); // ✅ Kunci aplikasi
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
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