import os from "os";
import { exec } from "child_process";

export interface ARPCacheEntry {
	ip: string,
	mac: string
}

export class ARPCache {
	private constructor() {}

	// Matches IP address and MAC address in an ARP cache entry.
	//
	// Note on IP address part: This part of the regular expression is created for extraction, not for validation of IP addresses.
	// Note on MAC address part: Modified from https://stackoverflow.com/a/4260512/2013757
	private static readonly RE_ARP_CACHE_ENTRY: RegExp = /^.*?((?:[0-9]{1,3}\.){3}(?:[0-9]{1,3})){1}.*?((?:[0-9A-Fa-f]{1,2}[:-]){5}(?:[0-9A-Fa-f]{1,2})).*$/gm;

	static async getRawARPCache(): Promise<string> {
		let cmd: string = "";
		switch (os.platform()) {
			case "darwin":
			case "linux":
				cmd = "arp -a -n";
				break;

			case "win32":
				cmd = "arp -a";
				break;

			default:
				throw new Error("OS not supported.");
		}

		const promise = new Promise<string>((resolve, reject) => {
			exec(cmd, (error, stdout, stderr) => {
				if (error) {
					reject(error);
					return;
				}
				if (stderr && stderr.length > 0) {
					reject(new Error(stderr));
					return;
				}
				resolve(stdout);
			});
		});
		return await promise;
	}

	static async getARPCache(): Promise<ARPCacheEntry[]> {
		const rawARPCache = await this.getRawARPCache();

		let arpCache: ARPCacheEntry[] = [];
		let rawEntry;
		while ((rawEntry = this.RE_ARP_CACHE_ENTRY.exec(rawARPCache)) !== null) {
			arpCache.push({
				ip: rawEntry[1],
				mac: rawEntry[2]
			});
		}

		return arpCache;
	}
}
