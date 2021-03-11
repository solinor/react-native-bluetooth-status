import { useState, useEffect } from "react"
import { EmitterSubscription, Platform } from "react-native"
import {
  NativeModules,
  NativeEventEmitter
} from "react-native";
import { BLUETOOTH_STATES, BT_STATUS_EVENT, ListenerFunction } from "./types"

const { RNBluetoothManager } = NativeModules

class BluetoothManager {
  private subscription: EmitterSubscription
  private listener: ListenerFunction
  private bluetoothState: BLUETOOTH_STATES

  constructor() {
    const bluetoothEvent = new NativeEventEmitter(RNBluetoothManager)
    this.subscription = bluetoothEvent.addListener(BT_STATUS_EVENT, state => {
      const nativeState = Platform.OS === "ios" ? state : state.status
      const isStatusChanged = nativeState && (this.bluetoothState !== nativeState)
      this.bluetoothState = nativeState
      if (this.listener && isStatusChanged) {
        this.listener(this.isBTEnabled())
      }
    })
  }

  private isBTEnabled (): boolean {
    return this.bluetoothState === BLUETOOTH_STATES.ON
  }

  addListener(listener: ListenerFunction): void {
    this.listener = listener
  }

  removeListener(): void {
    this.listener = null
  }

  showBTPopupiOS (): void {
    if (Platform.OS === "ios") {
      RNBluetoothManager.manualInitialization(true)
    }
  }

  async getState(): Promise<boolean> {
    let btState = false
    if (Platform.OS === 'ios') {
      this.bluetoothState = await RNBluetoothManager.getStateAsync()
      btState = this.isBTEnabled()
    }
    if (Platform.OS === 'android') {
      btState = await RNBluetoothManager.getBluetoothState()
    }
    return btState
  }
  
  enable(status: boolean = true): void {
    if (Platform.OS === "android") {
      RNBluetoothManager.setBluetoothState(status)
    }
  }

  disable(): void {
    this.enable(false)
  }
}

export const BluetoothStatus = new BluetoothManager()

const setBluetoothState = (status: boolean = true): void => {
  if (Platform.OS === "android") {
    RNBluetoothManager.setBluetoothState(status)
  }
}

export const useBluetoothStatus = () => {
  const [status, setStatus] = useState(undefined)
  const [isPending, setPending] = useState(true)

  useEffect(() => {
    const bluetoothEvent = new NativeEventEmitter(RNBluetoothManager)
    const subscription = bluetoothEvent.addListener(BT_STATUS_EVENT, state => {
      const nativeState = Platform.OS === "ios" ? state : state.status
      setStatus(nativeState === BLUETOOTH_STATES.ON)
    })
    return () => {
      bluetoothEvent.removeSubscription(subscription)
    }
  }, [])

  useEffect(() => {
    if (status !== undefined && isPending) {
      setPending(false)
    }
  }, [status])

  return [status, isPending, setBluetoothState]
}
