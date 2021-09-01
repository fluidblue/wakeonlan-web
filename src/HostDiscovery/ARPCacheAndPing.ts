import { HostDiscovery } from "./HostDiscovery"
import { MACFunctions, MacAddressBytes } from "./MACFunctions"
import { IPFunctions, IPNetwork, IPAddressNumerical } from "./IPFunctions";
import { Ping } from "./Ping";
import { ARPCache, ARPCacheEntry } from "./ARPCache";

export default class ARPCacheAndPing implements HostDiscovery {
	private static readonly PING_WAIT: number = 10; // in milliseconds

	async discover(
		ipSubnet: IPNetwork,
		callbackProgress?: (done: number, total: number) => void | null,
		callbackHostFound?: (ipAddress: string, macAddress: MacAddressBytes) => void | null
	): Promise<ARPCacheEntry[]> {
		if (ipSubnet.prefix < 1 || ipSubnet.prefix > 32) {
			throw new RangeError("IP prefix must be between 1 and 32.");
		}

		const hosts: ARPCacheEntry[] = [];
		const runningPromises: Promise<ARPCacheEntry | null>[] = [];

		const ipFirst: number = IPFunctions.getFirstAddress(ipSubnet);
		const ipLast: number = IPFunctions.getLastAddress(ipSubnet);

		let lastRun = this.getTimeInMilliseconds();
		for (let ip = ipFirst; ip <= ipLast; ip++) {
			// Start discovering host
			const promise = this.discoverHost(ip);
			runningPromises.push(promise);

			// Calculate duration
			const currentTime = this.getTimeInMilliseconds();
			const duration = currentTime - lastRun;
			lastRun = currentTime;

			// Delay ping requests to avoid packet loss
			if (duration < ARPCacheAndPing.PING_WAIT) {
				await this.delay(ARPCacheAndPing.PING_WAIT - duration);
			}
		}

		// Wait for all promises to finish
		for (let i = 0; i < runningPromises.length; i++) {
			const host: ARPCacheEntry | null = await runningPromises[i];
			if (host) {
				hosts.push(host);
				if (callbackHostFound) {
					callbackHostFound(host.ip, MACFunctions.getByteArrayFromMacAddress(host.mac));
				}
			}
			if (callbackProgress) {
				callbackProgress(i + 1, runningPromises.length);
			}
		}

		return hosts;
	}

	async discoverHost(ip: IPAddressNumerical): Promise<ARPCacheEntry | null> {
		let ipString: string = IPFunctions.getStringIP(ip);

		await Ping.ping(ipString);
		const arpCache = await ARPCache.getARPCache();

		for (let entry of arpCache) {
			const numericEntryIP = IPFunctions.getNumericalIP(entry.ip);
			if (ip === numericEntryIP) {
				return entry;
			}
		}
		return null;
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
