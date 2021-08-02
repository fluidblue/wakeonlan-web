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
	wake(options: WakeOnLanOptions): Promise<void>;
}

class NativeNode implements WakeOnLan {
	async wake(options: WakeOnLanOptions): Promise<void> {
		console.log(options);
	}
}
