//
//  RNBluetoothManager.h

#ifndef RNBluetoothManager_h
#define RNBluetoothManager_h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RNBluetoothManager : RCTEventEmitter <RCTBridgeModule, CBCentralManagerDelegate>

@property(strong, nonatomic) CBCentralManager *centralManager;

@end

#endif /* RNBluetoothManager_h */
