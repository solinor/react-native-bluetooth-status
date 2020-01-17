# react-native-bluetooth-status

React Native library to monitor and manage bluetooth state. Monitoring the bluetooth state works cross-plaform (iOS & Android).
In addition, Android can directly enable / disable bluetooth.
**V2 introduced new Hooks API!**

## Installation

`$ npm install react-native-bluetooth-status --save`

On RN 0.60+ with autolinking run `pod install` in your `ios/` folder.

##### RN < 0.60

`$ react-native link react-native-bluetooth-status`

<details>
  <summary>Manual installation on older RN versions</summary>

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-bluetooth-status` and add `RNBluetoothManager.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNBluetoothManager.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`

1.1 Add `import com.solinor.bluetoothstatus.RNBluetoothManagerPackage;` to the imports at the top of the file

1.2 Add `new RNBluetoothManagerPackage()` to the list returned by the `getPackages()` method in that file  
Note: If you add it to the end of the list it should look something like this:

```
 @Override
 protected List<ReactPackage> getPackages() {
   return Arrays.<ReactPackage>asList(
       new MainReactPackage(),         // Note the addtional comma needed for the original last item in the list
       new RNBluetoothManagerPackage() // For https://github.com/solinor/react-native-bluetooth-status
   );
 }
```

2. Append the following lines to `android/settings.gradle`:
   ```
   include ':react-native-bluetooth-status'
   project(':react-native-bluetooth-status').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-bluetooth-status/android')
   ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
   ```
     compile project(':react-native-bluetooth-status')
   ```

</details>
## Usage

### Hooks API:

```javascript
import { useBluetoothStatus } from 'react-native-bluetooth-status';

...

const [btStatus, isPending, setBluetooth] = useBluetoothStatus();
return (
  {!isPending && <Text>{btStatus ? 'On' : 'Off'}</Text>}
  <Button title="Toggle BT" onPress={() => setBluetooth(!btStatus)} />
)
```

| Variable         | Description                                                                                                                     |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **btStatus**     | Current Bluetooth status. Starts undefined, but updated asynchronously right away. Updated automatically if status changes.     |
| **isPending**    | Starts at true and after getting first Bluetooth status, is set to false. Helps to know when btStatus is not undefined anymore. |
| **setBluetooth** | **Android Only** Enables / disabled bluetooth. Takes boolean parameter (defaults to true) to select the operation.              |

### Imperative API

```javascript
import { BluetoothStatus } from 'react-native-bluetooth-status';

...

async getBluetoothState() {
  const isEnabled = await BluetoothStatus.state();
}

```

For further usage examples, see the [example project](examples/BTStatusTest/) using this library.

| Method             | Description                                                                                                                 |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **state**          | Returns a promise, which will return a boolean value, `true` if bluetooth is enabled, `false` if disabled.                  |
| **addListener**    | Takes function parameter, which will be run when BT status changes, with the new BT on/off status (true / false).           |
| **removeListener** | Removes listener.                                                                                                           |
| **enable**         | **Android only** Changes bluetooth state. Takes boolean parameter (defaults to true), `true` to enable, `false` to disable. |
| **disable**        | **Android only** Disables bluetooth, same end result as calling `enable(false)`.                                            |
