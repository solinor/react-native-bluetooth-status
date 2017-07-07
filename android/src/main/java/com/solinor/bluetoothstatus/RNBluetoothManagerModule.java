package com.solinor.bluetoothstatus;

import android.bluetooth.BluetoothAdapter;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class RNBluetoothManagerModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private BluetoothAdapter btAdapter;

    public RNBluetoothManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        btAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    @Override
    public String getName() {
        return "RNBluetoothManager";
    }

    @ReactMethod
    public void getBluetoothState(Callback callback) {
        boolean isEnabled = false;
        if (btAdapter != null) {
            isEnabled = btAdapter.isEnabled();
        }
        callback.invoke(null, isEnabled);
    }

    @ReactMethod
    public void setBluetoothOn(Callback callback) {
        if (btAdapter != null) {
            btAdapter.enable();
        }
        callback.invoke(null, btAdapter != null);
    }

    @ReactMethod
    public void setBluetoothOff(Callback callback) {
        if (btAdapter != null) {
            btAdapter.disable();
        }
        callback.invoke(null, btAdapter != null);
    }
}