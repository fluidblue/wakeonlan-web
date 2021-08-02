import { HostDiscovery } from "./HostDiscovery"
import ARPCacheEntry from "./ARPCacheEntry"
import { MAC_ADDR_LENGTH } from "../constants"
import { exec } from "child_process";
import { IPFunctions, IPNetwork } from "./IPFunctions";
import { Ping } from "./Ping";
import os from "os";

export default class ARPCacheAndPing implements HostDiscovery {
	private readonly PING_WAIT: number = 10; // in milliseconds

	// Matches IP address and MAC address in an ARP cache entry.
	//
	// Note on IP address part: This part of the regular expression is created for extraction, not for validation of IP addresses.
	// Note on MAC address part: Modified from https://stackoverflow.com/a/4260512/2013757
	private readonly RE_ARP_CACHE_ENTRY: RegExp = /^.*?((?:[0-9]{1,3}\.){3}(?:[0-9]{1,3})){1}.*?((?:[0-9A-Fa-f]{1,2}[:-]){5}(?:[0-9A-Fa-f]{1,2})).*$/gm;

	async discover(
		ipSubnet: IPNetwork,
		callbackProgress: (done: number, total: number) => void,
		callbackHostFound: (ipAddress: string, macAddress: Uint8Array) => void
	): Promise<void> {
		if (ipSubnet.prefix < 1 || ipSubnet.prefix > 32) {
			throw new RangeError("ipSubnet.prefix must be between 1 and 32.");
		}

		const ipFirst: number = IPFunctions.getFirstAddress(ipSubnet);
		const ipLast: number = IPFunctions.getLastAddress(ipSubnet);

		const totalIPs = ipLast - ipFirst + 1;
		let hosts: ARPCacheEntry[] = [];

		let i = 0;
		for (let ip = ipFirst; ip <= ipLast; ip++) {
			let ipString: string = IPFunctions.getStringIP(ip);
			console.log(ipString); // TODO: Remove

			Ping.ping(ipString, (error) => {
				if (error) {
					return;
				}
				this.getARPCache((error, result) => {
					if (error || !result) {
						return;
					}

					let newHosts: ARPCacheEntry[] = [];
					for (let entry of result) {
						console.log(entry); // TODO: Remove

						const numericIP = IPFunctions.getNumericalIP(entry.ip);
						if (numericIP < ipFirst || numericIP > ipLast) {
							continue;
						}

						hosts.forEach((host) => {
							// Skip already processed entries
							if (host.ip === entry.ip && host.mac === entry.mac) {
								return;
							}
							newHosts.push(host);
						});
					}

					for (let host of newHosts) {
						hosts.push(host);
						callbackHostFound(host.ip, this.getByteArrayFromMacAddress(host.mac));
					}
				});
			});

			i++;
			callbackProgress(i, totalIPs);

			await this.delay(this.PING_WAIT);
		}
	}

	async delay(milliseconds: number): Promise<void> {
		return new Promise<void>((resolve) => {
			setTimeout(resolve, milliseconds);
		});
	}

	getByteArrayFromMacAddress(mac: string): Uint8Array {
		const result: Uint8Array = Buffer.alloc(MAC_ADDR_LENGTH);
		const macParts = mac.split(/\:|\-/);
		for (let i = 0; i < macParts.length; i++) {
			result[i] = parseInt(macParts[i], 16);
		}
		return result;
	}

	isAvailable(callback: (res: boolean) => void): void {
		this.getRawARPCache((error, result) => {
			if (error || !result || result.length === 0) {
				callback(false);
				return;
			}

			Ping.ping("127.0.0.1", (error) => {
				if (error) {
					callback(false);
					return;
				}
				callback(true);
			});
		});
	}

	getRawARPCache(callback: (error: Error | null, result?: string) => void): void {
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

	getARPCache(callback: (error: Error | null, result?: ARPCacheEntry[]) => void): void {
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
