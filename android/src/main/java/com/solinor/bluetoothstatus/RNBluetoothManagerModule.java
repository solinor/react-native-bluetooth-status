package com.solinor.bluetoothstatus;

import android.bluetooth.BluetoothAdapter;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Handler;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RNBluetoothManagerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    final static String MODULE_NAME = "RNBluetoothManager";

    private final ReactApplicationContext reactContext;

    private BluetoothAdapter btAdapter;

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private final BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            final String action = intent.getAction();
            WritableMap params = Arguments.createMap();
            if (action.equals(BluetoothAdapter.ACTION_STATE_CHANGED)) {
                final int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE,
                        BluetoothAdapter.ERROR);
                switch (state) {
                    case BluetoothAdapter.STATE_OFF:
                        params.putString("status", "off");
                        sendEvent(reactContext, "bluetoothStatus", params);
                        break;
                    case BluetoothAdapter.STATE_ON:
                        params.putString("status", "on");
                        sendEvent(reactContext, "bluetoothStatus", params);
                        break;
                }
            }
        }
    };

    public RNBluetoothManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addLifecycleEventListener(this);
        btAdapter = BluetoothAdapter.getDefaultAdapter();
        IntentFilter filter = new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED);
        reactContext.registerReceiver(receiver, filter);
    }

    @Override
    public String getName() {
        return this.MODULE_NAME;
    }

    @ReactMethod
    public void getBluetoothState(Promise promise) {
        boolean isEnabled = false;
        if (btAdapter != null) {
            isEnabled = btAdapter.isEnabled();
        }
        promise.resolve(isEnabled);
    }

    @ReactMethod
    public void setBluetoothState(boolean enabled) {
        if  (btAdapter != null) {
            if (enabled) {
                btAdapter.enable();
            } else {
                btAdapter.disable();
            }
        }
    }

    @ReactMethod
    public void setBluetoothOn(Callback callback) {
        if (btAdapter != null) {
            btAdapter.enable();
        }
        callback.invoke(null, btAdapter.isEnabled());
    }

    @ReactMethod
    public void setBluetoothOff(Callback callback) {
        if (btAdapter != null) {
            btAdapter.disable();
        }
        callback.invoke(null, btAdapter.isEnabled());
    }

    @Override
    public void onHostResume() {
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                WritableMap params = Arguments.createMap();
                String enabled = btAdapter.isEnabled() ? "on" : "off";
                params.putString("status", enabled);
                sendEvent(reactContext, "bluetoothStatus", params);

            }
        }, 10);
    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        reactContext.unregisterReceiver(receiver);
    }
}