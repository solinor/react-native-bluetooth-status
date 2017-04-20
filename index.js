import {Platform} from 'react-native'
import {NativeModules, DeviceEventEmitter, NativeEventEmitter} from 'react-native'

class RNBluetoothManager {

  constructor() {
    this.bluetoothManager = NativeModules.RNBluetoothManager;
    const bluetoothEvent = new NativeEventEmitter(NativeModules.RNBluetoothManager);
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
        this.bluetoothManager.getBluetoothState((error, status) => {
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
        this.bluetoothManager.initialize();
      }
    });
  };

  async enable(enabled = true) {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        if (enabled) {
          this.bluetoothManager.setBluetoothOn((error, done) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(done);
          });
        } else {
          this.bluetoothManager.setBluetoothOff((error, done) => {
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
    return enable(false);
  };

  openBluetoothSettings() {
    if (Platform.OS === 'ios') {
      this.bluetoothManager.openBluetoothSettings(() => {
      })
    }
  }
}

export let BluetoothManager = new RNBluetoothManager();