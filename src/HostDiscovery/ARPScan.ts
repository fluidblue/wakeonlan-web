import { HostDiscovery } from "./HostDiscovery"
import { IPNetwork } from "./IPFunctions";
import { MacAddressBytes } from "./MACFunctions";
import { ARPCacheEntry } from "./ARPCache";
import { spawn } from "child_process";
import net from "net";

const delimeter: string = "\n";

export default class ARPScan implements HostDiscovery {
	async discover(
		ipSubnet: IPNetwork,
		callbackProgress: (done: number, total: number) => void,
		callbackHostFound: (ipAddress: string, macAddress: MacAddressBytes) => void
	): Promise<ARPCacheEntry[]> {
		const hosts: ARPCacheEntry[] = [];

		// TODO
		return hosts;
	}

	createChunkAssembler(callback: (line: string) => void) {
		let lastChunk: string = "";
		return function(data: any) {
			const dataChunks = data.toString().split(delimeter);
			if (dataChunks.length > 0) {
				dataChunks[0] = lastChunk + dataChunks[0];
				lastChunk = dataChunks.pop()!;
			}
			for (let line of dataChunks) {
				callback(line);
			}
		}
	}

	async isAvailable(): Promise<boolean> {
		// TODO
		return true;
	}
}
