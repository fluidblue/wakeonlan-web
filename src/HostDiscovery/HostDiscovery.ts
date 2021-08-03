import { IPNetwork } from "./IPFunctions";
import { MacAddressBytes } from "./MACFunctions";

export interface HostDiscovery {
	discover(
		ipSubnet: IPNetwork,
		callbackProgress: (done: number, total: number) => void,
		callbackHostFound: (ipAddress: string, macAddress: MacAddressBytes) => void
	): Promise<void>;

	isAvailable(): Promise<boolean>;
}
