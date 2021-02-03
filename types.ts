export const BT_STATUS_EVENT = "bluetoothStatus"

export enum BLUETOOTH_STATES {
  UNKNOWN = "unknown",
  RESETTING = "resetting",
  UNSUPPORTED = "unsupported",
  UNAUTHORIZED = "unauthorized",
  OFF = "off",
  ON = "on"
}

export type ListenerFunction = (state: boolean) => void
