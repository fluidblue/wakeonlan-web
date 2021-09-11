import { MacAddressBytes, IPNetwork } from "wakeonlan-utilities";
import { ARPCacheEntry } from "./ARPCache";

export interface HostDiscovery {
	discover(
		ipSubnet: IPNetwork,
		callbackProgress?: (done: number, total: number) => void,
		callbackHostFound?: (ipAddress: string, macAddress: MacAddressBytes) => void
	): Promise<ARPCacheEntry[]>;

	isAvailable(): Promise<boolean>;
}
