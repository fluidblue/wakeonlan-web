const WAKE_ON_LAN_PORT: number = 9;
const IP_BROADCAST_ADDRESS: string = "255.255.255.255";

interface WakeOnLanOptions {
	port?: number;
	address?: string;
};

const wakeOnLanOptionsDefault: WakeOnLanOptions = {
	port: WAKE_ON_LAN_PORT,
	address: IP_BROADCAST_ADDRESS
};

interface WakeOnLan {
	wake(options?: WakeOnLanOptions, callback?: (error: Error | null) => void): void;
}

class NativeNodeJs implements WakeOnLan {
	wake(options?: WakeOnLanOptions, callback?: (error: Error | null) => void): void {
		console.log(options);
	}
}

let nativeNodeJs: NativeNodeJs = new NativeNodeJs();
