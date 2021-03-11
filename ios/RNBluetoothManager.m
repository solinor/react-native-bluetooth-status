//
//  RNBluetoothManager.m
//  taskuparkkiReactNativeWorkShop
//
//  Created by Juha Linnanen on 20/03/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import "UIKit/UIKit.h"
#import "RNBluetoothManager.h"

#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)


@implementation RNBluetoothManager
{
    bool hasListeners;
    NSString *stateName;
}
RCT_EXPORT_MODULE();

+ (BOOL) requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_METHOD(manualInitialization: (BOOL *)showPopup )
{
    [self createCentralManager:showPopup];
}
- (void)createCentralManager: (BOOL*) showPopup
{
    self.centralManager = [[CBCentralManager alloc] initWithDelegate:self queue:nil options:@{CBCentralManagerOptionShowPowerAlertKey:[NSNumber numberWithBool:showPopup]}];
}

RCT_EXPORT_METHOD(removeInitialization)
{
    [self removeCentralManager];
}
- (void)removeCentralManager
{
    self.centralManager = nil;
}

RCT_EXPORT_METHOD(getStateAsync:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([self getBTState]);
}
- (NSString *)getBTState
{
    if (!self.centralManager) [self createCentralManager:false];
    return [self centralManagerStateToString:self.centralManager.state];
}


- (NSString *) centralManagerStateToString: (int)state
{
    switch (state) {
        case CBCentralManagerStateUnknown:
            return @"unknown";
        case CBCentralManagerStateResetting:
            return @"resetting";
        case CBCentralManagerStateUnsupported:
            return @"unsupported";
        case CBCentralManagerStateUnauthorized:
            return @"unauthorized";
        case CBCentralManagerStatePoweredOff:
            return @"off";
        case CBCentralManagerStatePoweredOn:
            return @"on";
        default:
            return @"unknown";
    }

    return @"unknown";
}

-(void)startObserving {
    hasListeners = YES;
    [self sendEventWithName:@"bluetoothStatus" body:stateName];
}

-(void)stopObserving {
    hasListeners = NO;
}

- (void)centralManagerDidUpdateState:(CBCentralManager *)central
{
    stateName = [self centralManagerStateToString:central.state];
    if (hasListeners) {
        [self sendEventWithName:@"bluetoothStatus" body:stateName];
    }
}

- (NSArray<NSString *> *)supportedEvents { return @[@"bluetoothStatus"]; }
@end


