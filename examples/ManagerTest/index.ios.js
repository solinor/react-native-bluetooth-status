// @flow

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  AppState
} from 'react-native';
import { BluetoothStatus } from 'react-native-bluetooth-status'

export default class ManagerTest extends Component {

  state = {
    bluetoothState: '',
    appState: AppState.currentState
  };

  componentDidMount() {
    AppState.addEventListener('change', (nextAppState) => this._handleAppStateChange(nextAppState));
    this.checkInitialBluetoothState();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  async checkInitialBluetoothState() {
    const isEnabled = await this.updateBluetoothStatus();
    if (!isEnabled) {
      this.requireBluetooth();
    }
  }

  async updateBluetoothStatus() {
    return new Promise(async (resolve, reject) => {
      try {
        const isEnabled = await BluetoothStatus.state();
        this.setState({ bluetoothState: (isEnabled) ? 'On' : 'Off'});
        resolve(isEnabled);
      } catch (error) { reject(error) }
    });
  }

  _handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.updateBluetoothStatus();
    }
    this.setState({ appState: nextAppState });
  };

  requireBluetooth() {
    Alert.alert('bt required', 'much required',
      [{ text: 'Settings', onPress: () => BluetoothStatus.openBluetoothSettings() },
       { text: 'Cancel', onPress: () => {} }],
       { cancelable: false }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          Bluetooth is: { this.state.bluetoothState }
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ManagerTest', () => ManagerTest);
