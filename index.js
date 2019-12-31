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

class BluetoothManager {
  subscription: mixed;
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
    this.subscription = bluetoothEvent.addListener("bluetoothStatus", state => {
      const nativeState = Platform.OS === "ios" ? state : state.status;
      this.bluetoothState = nativeState;
      this.listener(this.bluetoothState === "on");
    });
  }

  addListener(listener: function) {
    this.listener = listener;
  }

  async state() {
    return new Promise((resolve, reject) => {
      waitUntil()
        .interval(100)
        .times(10)
        .condition(() => {
          return this.bluetoothState !== undefined;
        })
        .done(() => {
          console.log("found proper bt state: ", this.bluetoothState === "on");
          resolve(this.bluetoothState === "on");
        });
    });
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

const getBluetoothState = async () => {
  if (Platform.OS === "android") {
    return await RNBluetoothManager.getBluetoothState();
  }
};
export const useBluetoothStatus = () => {
  const [status, setStatus] = useState(undefined);
  const [isPending, setPending] = useState(true);

  useEffect(() => {
    const bluetoothEvent = new NativeEventEmitter(RNBluetoothManager);
    const subscription = bluetoothEvent.addListener(
      "bluetoothStatus",
      state => {
        console.log("bluetooth change received in listener: ", state);
        const nativeState = Platform.OS === "ios" ? state : state.status;
        console.log("native state:", nativeState);
        setStatus(nativeState === "on" ? true : false);
      }
    );
    return () => {
      bluetoothEvent.removeSubscription(subscription);
    };
  }, []);

  useEffect(() => {
    if (status !== undefined && isPending) {
      setPending(false);
    }
  }, [status]);

  console.log("current status: ", status);
  return [
    status,
    isPending,
    (enable: boolean = !status) => {
      if (Platform.OS === "android") {
        RNBluetoothManager.setBluetoothState(enable);
      }
    }
  ];
};
