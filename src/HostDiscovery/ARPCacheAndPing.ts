import { HostDiscovery } from "./HostDiscovery"
import { MACFunctions, MacAddressBytes } from "./MACFunctions"
import { IPFunctions, IPNetwork, IPAddressNumerical } from "./IPFunctions";
import { Ping } from "./Ping";
import { ARPCache, ARPCacheEntry } from "./ARPCache";

export default class ARPCacheAndPing implements HostDiscovery {
	private readonly PING_WAIT: number = 10; // in milliseconds // TODO: Use it

	private hosts: ARPCacheEntry[] = [];
	private callbackHostFound: ((ipAddress: string, macAddress: MacAddressBytes) => void) | null = null;

	async discover(
		ipSubnet: IPNetwork,
		callbackProgress: (done: number, total: number) => void,
		callbackHostFound: (ipAddress: string, macAddress: MacAddressBytes) => void
	): Promise<void> {
		if (ipSubnet.prefix < 1 || ipSubnet.prefix > 32) {
			throw new RangeError("IP prefix must be between 1 and 32.");
		}

		this.callbackHostFound = callbackHostFound;

		const ipFirst: number = IPFunctions.getFirstAddress(ipSubnet);
		const ipLast: number = IPFunctions.getLastAddress(ipSubnet);

		const totalIPs = ipLast - ipFirst + 1;
		this.hosts = [];

		let i = 0;
		for (let ip = ipFirst; ip <= ipLast; ip++) {
			await this.discoverHost(ip);

			i++;
			callbackProgress(i, totalIPs);
		}

		this.callbackHostFound = null;
	}

	async discoverHost(ip: IPAddressNumerical): Promise<void> {
		let ipString: string = IPFunctions.getStringIP(ip);

		await Ping.ping(ipString);
		const arpCache = await ARPCache.getARPCache();

		for (let entry of arpCache) {
			const numericEntryIP = IPFunctions.getNumericalIP(entry.ip);
			if (ip === numericEntryIP) {
				this.hosts.push(entry);
				if (this.callbackHostFound) {
					this.callbackHostFound(entry.ip, MACFunctions.getByteArrayFromMacAddress(entry.mac));
				}
			}
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
