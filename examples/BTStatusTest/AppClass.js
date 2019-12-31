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
      console.log('listener received bt state: ', isEnabled);
      this.setState({bluetoothState: isEnabled ? 'On' : 'Off'});
    });
  }

  async checkInitialBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    console.log('got bt state: ', isEnabled);
    this.setState({bluetoothState: isEnabled ? 'On' : 'Off'});
  }

  async toggleBluetooth() {
    const isEnabled = await BluetoothStatus.state();
    BluetoothStatus.enable(!isEnabled);
    //this.setState({bluetoothState: isEnabled ? 'Off' : 'On'});
  }

  render() {
    const {bluetoothState} = this.state;
    console.log('render bt state: ', bluetoothState);
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
