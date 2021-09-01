import { IPNetwork } from "./IPFunctions";
import { MacAddressBytes } from "./MACFunctions";
import { ARPCacheEntry } from "./ARPCache";

export interface HostDiscovery {
	discover(
		ipSubnet: IPNetwork,
		callbackProgress?: (done: number, total: number) => void | null,
		callbackHostFound?: (ipAddress: string, macAddress: MacAddressBytes) => void | null
	): Promise<ARPCacheEntry[]>;

	isAvailable(): Promise<boolean>;
}
