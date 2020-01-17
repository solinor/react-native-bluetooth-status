import React from 'react';
import {SafeAreaView, Text, StatusBar, Platform, Button} from 'react-native';
import {useBluetoothStatus} from 'react-native-bluetooth-status';

const App = () => {
  const [btStatus, isPending, setBluetooth] = useBluetoothStatus();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text>New tester is here!</Text>
        {!isPending && <Text>{btStatus ? 'On' : 'Off'}</Text>}
        {Platform.OS === 'android' && (
          <Button title="Toggle BT" onPress={() => setBluetooth(!btStatus)} />
        )}
      </SafeAreaView>
    </>
  );
};

export default App;
