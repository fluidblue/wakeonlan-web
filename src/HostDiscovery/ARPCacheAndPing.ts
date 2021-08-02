import { HostDiscovery } from "./HostDiscovery"
import { MACFunctions } from "./MACFunctions"
import { IPFunctions, IPNetwork } from "./IPFunctions";
import { Ping } from "./Ping";
import { ARPCache, ARPCacheEntry } from "./ARPCache";

export default class ARPCacheAndPing implements HostDiscovery {
	private readonly PING_WAIT: number = 10; // in milliseconds // TODO: Use it

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

			await Ping.ping(ipString);
			const arpCache = await ARPCache.getARPCache();

			let newHosts: ARPCacheEntry[] = [];
			for (let entry of arpCache) {
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
				callbackHostFound(host.ip, MACFunctions.getByteArrayFromMacAddress(host.mac));
			}

			i++;
			callbackProgress(i, totalIPs);
		}
	}

	async isAvailable(): Promise<boolean> {
		try {
			await Ping.ping("127.0.0.1");
			await ARPCache.getRawARPCache();
		} catch (error) {
			return false;
		}
		return true;
	}
}
