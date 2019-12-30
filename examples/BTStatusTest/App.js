import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {BluetoothStatus} from 'react-native-bluetooth-status';

const updateBluetoothStatus = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const isEnabled = await BluetoothStatus.state();
      resolve(isEnabled);
    } catch (error) {
      reject(error);
    }
  });
};

const App = () => {
  const [btStatus, setBtStatus] = useState(undefined);
  console.log('btStatus', btStatus);
  useEffect(() => {
    (async function() {
      const isEnabled = await updateBluetoothStatus();
      console.log(isEnabled);
      setBtStatus(isEnabled);
    })();
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text>New tester is here!</Text>
        {btStatus !== undefined && <Text>{btStatus ? 'On' : 'Off'}</Text>}
      </SafeAreaView>
    </>
  );
};

export default App;
