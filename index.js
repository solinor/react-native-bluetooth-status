// @flow

import { Platform } from 'react-native'
import { NativeModules, DeviceEventEmitter, NativeEventEmitter} from 'react-native'
import waitUntil from '@cs125/wait-until'

const { RNBluetoothManager } = NativeModules;

class BluetoothManager {

  subscription: mixed;
  bluetoothState: 'unknown' | 'resetting' | 'unsupported' | 'unauthorized' |'off' | 'on' | 'unknown';

  constructor() {
    const bluetoothEvent = new NativeEventEmitter(RNBluetoothManager);
    this.subscription = bluetoothEvent.addListener('bluetoothStatus', (state) => {
      this.bluetoothState = state;
    });
  }

  async state() {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        RNBluetoothManager.getBluetoothState((error, status) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(status);
        });
      } else if (Platform.OS === 'ios') {
        waitUntil()
          .interval(100)
          .times(10)
          .condition(() => {
            return this.bluetoothState !== undefined
          })
          .done(() => {
            resolve(this.bluetoothState === 'on');
          })
      }
    });
  };

  async enable(enabled: boolean = true) {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        if (enabled) {
          RNBluetoothManager.setBluetoothOn((error, done) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(done);
          });
        } else {
          RNBluetoothManager.setBluetoothOff((error, done) => {
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
}

export let BluetoothStatus = new BluetoothManager();
