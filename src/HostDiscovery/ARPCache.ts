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

	static getRawARPCache(callback: (error: Error | null, result?: string) => void): void {
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
				if (callback) {
					callback(new Error("OS not supported."));
				}
				return;
		}

		exec(cmd, (error, stdout, stderr) => {
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

	static getARPCache(callback: (error: Error | null, result?: ARPCacheEntry[]) => void): void {
		this.getRawARPCache((error, rawARPCache) => {
			if (error) {
				callback(error);
				return;
			}
			if (!rawARPCache) {
				callback(new Error("Result missing."));
				return;
			}

			let arpCache: ARPCacheEntry[] = [];
			let rawEntry;
			while ((rawEntry = this.RE_ARP_CACHE_ENTRY.exec(rawARPCache)) !== null) {
				arpCache.push({
					ip: rawEntry[1],
					mac: rawEntry[2]
				});
			}

			callback(null, arpCache);
		});
	}
}
