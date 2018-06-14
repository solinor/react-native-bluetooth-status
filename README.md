
# react-native-bluetooth-status

React Native library to query and manage bluetooth state. Querying the bluetooth state works cross-plaform (iOS & Android). 
In addition, iOS can open the bluetooth settings and Android can directly enable / disable bluetooth.

## Getting started

`$ npm install react-native-bluetooth-status --save`

### Mostly automatic installation

`$ react-native link react-native-bluetooth-status`

### Manual installation


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
## Usage
```javascript
import { BluetoothStatus } from 'react-native-bluetooth-status';

...

  async getBluetoothState() {
    try {
      const isEnabled = await BluetoothStatus.state();
    } catch (error) { console.error(error); }
  }

```
  
For further usage examples, see the [example project](examples/ManagerTest/) using this library.

### API

| Method                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|:----------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **state** | Returns a promise, which will return a boolean value, `true` if bluetooth is enabled, `false` if disabled.                                                                                                                                                                                                                                                                                                            |
| **enable**    | **Android only** Changes bluetooth state. Takes boolean parameter (defaults to true), `true` to enable, `false` to disable. Returns a promise, which returns whether the change was successful or not.           |
| **disable**    | **Android only** Disables bluetooth, same end result as calling `enable(false)`. Returns a promise, which returns whether the change was successful or not.           |

#### Thanks

Thanks go to [react-native-bluetooth-state](https://github.com/frostney/react-native-bluetooth-state) library, which was used as the foundation of the iOS implementation. That library hasn't been maintained though, and didn't support Android, or anything other than getting the state.
