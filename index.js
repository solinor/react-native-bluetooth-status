// @flow
import { useState, useEffect } from "react";
import { Platform } from "react-native";
import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter
} from "react-native";
import waitUntil from "@cs125/wait-until";

const { RNBluetoothManager } = NativeModules;

const BT_STATUS_EVENT = "bluetoothStatus";
class BluetoothManager {
  subscription: mixed;
  inited: boolean;
  bluetoothState:
    | "unknown"
    | "resetting"
    | "unsupported"
    | "unauthorized"
    | "off"
    | "on"
    | "unknown";
  listener: function;

  constructor() {
    const bluetoothEvent = new NativeEventEmitter(RNBluetoothManager);
    this.subscription = bluetoothEvent.addListener(BT_STATUS_EVENT, state => {
      const nativeState = Platform.OS === "ios" ? state : state.status;
      this.bluetoothState = nativeState;
      if (this.listener) {
        this.listener(this.bluetoothState === "on");
      }
    });
  }

  addListener(listener: function) {
    this.listener = listener;
  }

  removeListener() {
    this.listener = undefined;
  }

  async state() {
    this.manualInit()
    return new Promise((resolve, reject) => {
      waitUntil()
        .interval(100)
        .times(10)
        .condition(() => {
          return this.bluetoothState !== undefined;
        })
        .done(() => {
          resolve(this.bluetoothState === "on");
        });
    });
  }

  manualInit() {
    if (Platform.OS === "ios") {
      if(!this.inited) {
        RNBluetoothManager.manualInitialization()
      }
      this.inited = true
    }
  }
  
  enable(enabled: boolean = true) {
    if (Platform.OS === "android") {
      RNBluetoothManager.setBluetoothState(enabled);
    }
  }

  async disable() {
    return this.enable(false);
  }
}

export const BluetoothStatus = new BluetoothManager();

const setBluetoothState = (enable: boolean = true) => {
  if (Platform.OS === "android") {
    RNBluetoothManager.setBluetoothState(enable);
  }
};

export const useBluetoothStatus = () => {
  const [status, setStatus] = useState(undefined);
  const [isPending, setPending] = useState(true);

  useEffect(() => {
    const bluetoothEvent = new NativeEventEmitter(RNBluetoothManager);
    const subscription = bluetoothEvent.addListener(BT_STATUS_EVENT, state => {
      const nativeState = Platform.OS === "ios" ? state : state.status;
      setStatus(nativeState === "on");
    });
    return () => {
      bluetoothEvent.removeSubscription(subscription);
    };
  }, []);

  useEffect(() => {
    if (status !== undefined && isPending) {
      setPending(false);
    }
  }, [status]);

  return [status, isPending, setBluetoothState];
};
