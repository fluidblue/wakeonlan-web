import { MACFunctions, MacAddressBytes } from "wakeonlan-utilities"

export interface WakeOnLanOptions {
	port?: number;
	address?: string;
}

export abstract class WakeOnLan {
	static readonly DEFAULT_PORT: number = 9;
	static readonly IP_BROADCAST_ADDRESS: string = "255.255.255.255";

	static readonly optionsDefault: WakeOnLanOptions = {
		port: WakeOnLan.DEFAULT_PORT,
		address: WakeOnLan.IP_BROADCAST_ADDRESS
	};

	abstract wake(macAddress: MacAddressBytes, options?: WakeOnLanOptions): Promise<void>;
}
