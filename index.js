// @flow

import { Platform } from 'react-native'
import { NativeModules, DeviceEventEmitter, NativeEventEmitter} from 'react-native'

const { BluetoothManager } = NativeModules;

class RNBluetoothManager {

  subscription: mixed;
  subscriber: Function;

  constructor() {
    const bluetoothEvent = new NativeEventEmitter(BluetoothManager);
    this.subscription = bluetoothEvent.addListener('bluetoothStatus', (...args) => {
        this.subscriber(this, args);
      }
    );
    this.subscriber = () => {
    }
  }

  async state() {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        BluetoothManager.getBluetoothState((error, status) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(status);
        });
      } else if (Platform.OS === 'ios') {
        this.subscriber = (manager, responseArray) => {
          let bluetoothState = responseArray[0];
          if (bluetoothState !== 'on' && bluetoothState !== 'off') {
            return;
          }
          this.subscriber = () => {};
          resolve(bluetoothState === 'on');
        };
        BluetoothManager.initialize();
      }
    });
  };

  async enable(enabled: boolean = true) {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        if (enabled) {
          BluetoothManager.setBluetoothOn((error, done) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(done);
          });
        } else {
          BluetoothManager.setBluetoothOff((error, done) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(done);
          });
        }
      } else {
        reject('Unsupported platform');
      }
    });
  }

  async disable() {
    return this.enable(false);
  };

  openBluetoothSettings() {
    if (Platform.OS === 'ios') {
      BluetoothManager.openBluetoothSettings(() => {
      })
    }
  }
}

export let BluetoothStatus = new RNBluetoothManager();