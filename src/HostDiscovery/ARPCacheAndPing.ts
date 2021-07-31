import { HostDiscovery, IPNetwork } from "./HostDiscovery"
import { exec } from "child_process";

class ARPCacheAndPing implements HostDiscovery {
	discover(
		ipSubnet: IPNetwork,
		callbackProgress: (done: number, total: number) => void,
		callbackHostFound: (ipAddress: string, macAddress: Uint8Array) => void,
		callbackDone: (err: Error | null) => void
	): void {
		// TODO
	}

	isAvailable(callback: (res: boolean) => void): void {
		this.getRawARPCache((error, result) => {
			if (error || !result || result.length === 0) {
				callback(false);
				return;
			}
			callback(true);
		});
	}

	getRawARPCache(callback: (error: Error | null, result?: string) => void): void {
		exec("arp -a -n", (error, stdout, stderr) => {
			if (error) {
				callback(error);
				return;
			}
			if (stderr && stderr.length > 0) {
				callback(Error(stderr));
				return;
			}
			callback(null, stdout);
		});
	}
}

let arpCacheAndPing = new ARPCacheAndPing();
arpCacheAndPing.isAvailable((res) => {
	console.log("Available: " + res);
});
