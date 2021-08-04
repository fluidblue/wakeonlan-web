import { HostDiscovery } from "./HostDiscovery"
import { MACFunctions, MacAddressBytes } from "./MACFunctions"
import { IPFunctions, IPNetwork, IPAddressNumerical } from "./IPFunctions";
import { Ping } from "./Ping";
import { ARPCache, ARPCacheEntry } from "./ARPCache";

export default class ARPCacheAndPing implements HostDiscovery {
	private static readonly PING_WAIT: number = 10; // in milliseconds

	async discover(
		ipSubnet: IPNetwork,
		callbackProgress: (done: number, total: number) => void
	): Promise<ARPCacheEntry[]> {
		if (ipSubnet.prefix < 1 || ipSubnet.prefix > 32) {
			throw new RangeError("IP prefix must be between 1 and 32.");
		}

		const ipFirst: number = IPFunctions.getFirstAddress(ipSubnet);
		const ipLast: number = IPFunctions.getLastAddress(ipSubnet);

		const runningPromises: Promise<void>[] = [];

		let lastRun = this.getTimeInMilliseconds();
		for (let ip = ipFirst; ip <= ipLast; ip++) {
			// Start pinging
			const ipString = IPFunctions.getStringIP(ip);
			const promise = Ping.ping(ipString);
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
			await runningPromises[i];
			callbackProgress(i + 1, runningPromises.length);
		}

		// Get relevant hosts from ARP Cache
		const hosts: ARPCacheEntry[] = await this.getARPCacheHosts(ipFirst, ipLast);

		return hosts;
	}

	async getARPCacheHosts(ipFirst: IPAddressNumerical, ipLast: IPAddressNumerical): Promise<ARPCacheEntry[]> {
		const arpCache = await ARPCache.getARPCache();

		const result: ARPCacheEntry[] = [];
		for (let entry of arpCache) {
			const numericEntryIP = IPFunctions.getNumericalIP(entry.ip);
			if (numericEntryIP >= ipFirst && numericEntryIP <= ipLast) {
				result.push(entry);
			}
		}

		return result;
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
