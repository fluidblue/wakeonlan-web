import { HostDiscovery } from "./HostDiscovery"
import { MACFunctions, MacAddressBytes } from "./MACFunctions"
import { IPFunctions, IPNetwork } from "./IPFunctions";
import { Ping } from "./Ping";
import { ARPCache, ARPCacheEntry } from "./ARPCache";

export default class ARPCacheAndPing implements HostDiscovery {
	private readonly PING_WAIT: number = 10; // in milliseconds // TODO: Use it

	async discover(
		ipSubnet: IPNetwork,
		callbackProgress: (done: number, total: number) => void,
		callbackHostFound: (ipAddress: string, macAddress: MacAddressBytes) => void
	): Promise<void> {
		if (ipSubnet.prefix < 1 || ipSubnet.prefix > 32) {
			throw new RangeError("IP prefix must be between 1 and 32.");
		}

		const ipFirst: number = IPFunctions.getFirstAddress(ipSubnet);
		const ipLast: number = IPFunctions.getLastAddress(ipSubnet);

		const totalIPs = ipLast - ipFirst + 1;
		let hosts: ARPCacheEntry[] = [];

		let i = 0;
		for (let ip = ipFirst; ip <= ipLast; ip++) {
			let ipString: string = IPFunctions.getStringIP(ip);

			await Ping.ping(ipString);
			const arpCache = await ARPCache.getARPCache();

			for (let entry of arpCache) {
				const numericEntryIP = IPFunctions.getNumericalIP(entry.ip);
				if (ip === numericEntryIP) {
					hosts.push(entry);
					callbackHostFound(entry.ip, MACFunctions.getByteArrayFromMacAddress(entry.mac));
				}
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
