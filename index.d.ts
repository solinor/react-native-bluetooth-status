interface BluetoothManager {
	constructor()

	subscription: any
	inited: boolean
	bluetoothState:
		| 'unknown'
		| 'resetting'
		| 'unsupported'
		| 'unauthorized'
		| 'off'
		| 'on'
		| 'unknown'
	listener: Function

	addListener(listener: Function): void

	removeListener(): void

	state(): Promise<boolean>

	manualInit(): void

	enable(enabled?: boolean): void

	disable(): Promise<void>
}
declare module 'react-native-bluetooth-status' {
	export const BluetoothStatus: BluetoothManager
	export function useBluetoothStatus(): [boolean, boolean, (enable?: boolean) => void]
}
