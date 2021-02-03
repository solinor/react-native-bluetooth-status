import { useState, useEffect } from "react"
import { EmitterSubscription, Platform } from "react-native"
import {
  NativeModules,
  NativeEventEmitter
} from "react-native";
import waitUntil from "@cs125/wait-until"
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
      this.bluetoothState = nativeState
      if (this.listener) {
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
    await RNBluetoothManager.getStateAsync()
    return new Promise((resolve, reject) => {
      waitUntil()
        .interval(100)
        .times(10)
        .condition(() => {
          return this.bluetoothState !== undefined
        })
        .done(() => {
          resolve(this.isBTEnabled())
        })
    })
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
