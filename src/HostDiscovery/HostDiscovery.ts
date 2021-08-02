import { IPNetwork } from "./IPFunctions";

export interface HostDiscovery {
	discover(
		ipSubnet: IPNetwork,
		callbackProgress: (done: number, total: number) => void,
		callbackHostFound: (ipAddress: string, macAddress: Uint8Array) => void
	): Promise<void>;

	isAvailable(): Promise<boolean>;
}
