import { HostDiscovery } from "./HostDiscovery"
import { MACFunctions, MacAddressBytes } from "./MACFunctions"
import { IPFunctions, IPNetwork, IPAddressNumerical } from "./IPFunctions";
import { Ping } from "./Ping";
import { ARPCache, ARPCacheEntry } from "./ARPCache";

export default class ARPCacheAndPing implements HostDiscovery {
	private static readonly PING_WAIT: number = 10; // in milliseconds

	private hosts: ARPCacheEntry[] = [];
	private callbackHostFound: ((ipAddress: string, macAddress: MacAddressBytes) => void) | null = null;

	private runningPromises: Promise<void>[] = [];

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
		let lastRun = this.getTimeInMilliseconds();
		for (let ip = ipFirst; ip <= ipLast; ip++) {
			// Start discovering host
			const promise = this.discoverHost(ip);
			this.runningPromises.push(promise);

			// Calculate duration
			const currentTime = this.getTimeInMilliseconds();
			const duration = currentTime - lastRun;
			lastRun = currentTime;

			// Delay ping requests to avoid packet loss
			if (duration < ARPCacheAndPing.PING_WAIT) {
				await this.delay(ARPCacheAndPing.PING_WAIT - duration);
			}

			i++;
			callbackProgress(i, totalIPs);
		}

		// Wait for all instances to finish.
		for (let instance of this.runningPromises) {
			await instance;
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

	delay(timeout: number): Promise<void> {
		return new Promise((resolve, reject) => {
			setTimeout(resolve, timeout);
		});
	}

	getTimeInMilliseconds(): number {
		return new Date().getTime();
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
