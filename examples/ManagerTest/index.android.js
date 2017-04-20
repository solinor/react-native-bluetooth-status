import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { BluetoothManager } from 'react-native-bluetooth-manager'

export default class ManagerTest extends Component {

  constructor(props) {
    super(props);

    this.state = {
      bluetoothState: ''
    };
  }

  async componentDidMount() {
    try {
      const isEnabled = await BluetoothManager.state();
      this.setState({ bluetoothState: (isEnabled) ? 'On' : 'Off'});
    } catch (error) { console.error(error); }
  }

  async toggleBluetooth() {
    try {
      const isEnabled = await BluetoothManager.state();
      BluetoothManager.enable(!isEnabled);
      this.setState({ bluetoothState: (isEnabled) ? 'Off' : 'On'});
    } catch (error) { console.error(error); }
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to React Native!
          </Text>
          <Button onPress={() => this.toggleBluetooth()}
                  title={'Bluetooth is: ' + this.state.bluetoothState} />
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

