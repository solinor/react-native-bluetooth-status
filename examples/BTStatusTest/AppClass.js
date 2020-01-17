import React from 'react';
import {SafeAreaView, Text, StatusBar, Platform, Button} from 'react-native';
import {
  BluetoothStatus,
  useBluetoothStatus,
} from 'react-native-bluetooth-status';

class AppClass extends React.Component {
  state = {
    bluetoothState: undefined,
  };

  componentDidMount() {
    this.checkInitialBluetoothState();
    BluetoothStatus.addListener(isEnabled => {
      this.setState({bluetoothState: isEnabled ? 'On' : 'Off'});
    });
  }

  async checkInitialBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    this.setState({bluetoothState: isEnabled ? 'On' : 'Off'});
  }

  async toggleBluetooth() {
    const isEnabled = await BluetoothStatus.state();
    BluetoothStatus.enable(!isEnabled);
  }

  render() {
    const {bluetoothState} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <Text>New tester is here!</Text>
          {bluetoothState !== undefined && <Text>{bluetoothState}</Text>}
          {Platform.OS === 'android' && (
            <Button title="Toggle BT" onPress={() => this.toggleBluetooth()} />
          )}
        </SafeAreaView>
      </>
    );
  }
}

export default AppClass;
