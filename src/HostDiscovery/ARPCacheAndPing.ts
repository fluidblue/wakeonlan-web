import { HostDiscovery, IPNetwork } from "./HostDiscovery"
import { exec } from "child_process";

class ARPCacheAndPing implements HostDiscovery {
	discover(
		ipSubnet: IPNetwork,
		callbackProgress: (done: number, total: number) => void,
		callbackHostFound: (ipAddress: string, macAddress: Uint8Array) => void,
		callbackDone: (success: boolean) => void
	): void {
		if (ipSubnet.prefix < 1 || ipSubnet.prefix > 32) {
			throw new RangeError("ipSubnet.prefix must be between 1 and 32.");
		}

		const ipNetwork: number = this.getNumberFromIP(ipSubnet.ip);
		const ipFirst: number = this.getFirstAddress(ipNetwork, ipSubnet.prefix);
		const ipLast: number = this.getLastAddress(ipNetwork, ipSubnet.prefix);

		const totalIPs = ipLast - ipFirst + 1;

		let i = 0;
		for (let ip = ipFirst; ip <= ipLast; ip++) {
			// TODO
			console.log(this.getIPFromNumber(ip));

			i++;
			callbackProgress(i, totalIPs);
		}
		callbackDone(true);
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

	getNumberFromIP(ip: string): number {
		// Assume IPv4 address
		const parts: string[] = ip.split(".");
		let result: number = 0;
		for (let i = 0; i < 4; i++) {
			result = (result | (parseInt(parts[i]) << ((3 - i) * 8))) >>> 0;
		}
		return result;
	}

	getIPFromNumber(ip: number): string {
		const result: number[] = [0, 0, 0, 0];
		for (let i = 0; i < 4; i++) {
			const shift = ((3 - i) * 8);
			result[i] = (ip & (0xFF << shift)) >>> shift;
		}
		return result.join(".");
	}

	getSubnetMask(subnet: number): number {
		return (0xFFFFFFFF << (32 - subnet)) >>> 0;
	}

	getCleanNetworkAddress(ip: number, subnetMask: number): number {
		return (ip & subnetMask) >>> 0;
	}

	getFirstAddress(ipNetwork: number, subnet: number): number {
		const subnetMask = this.getSubnetMask(subnet);
		ipNetwork = this.getCleanNetworkAddress(ipNetwork, subnetMask);

		// If subnet == 32, the only host address is the net address.
		// If subnet == 31, the first host address is the net address.
		// If subnet <= 30, the first host address is the IP address after the net address.
		let ipFirst = ipNetwork;
		if (subnet <= 30) {
			ipFirst++;
		}

		return ipFirst;
	}

	getLastAddress(ipNetwork: number, subnet: number): number {
		const subnetMask = this.getSubnetMask(subnet);
		ipNetwork = this.getCleanNetworkAddress(ipNetwork, subnetMask);

		const subnetMaskInverted = (~subnetMask) >>> 0;

		// If subnet == 32, the only host address is the net address.
		// If subnet == 31, the last host address is the last address in the address space.
		// If subnet <= 30, the last host address is the IP address before the last address
		// in the address space (which is the broadcast address).
		let ipLast = (ipNetwork | subnetMaskInverted) >>> 0;
		if (subnet <= 30) {
			ipLast--;
		}

		return ipLast;
	}
}

export default ARPCacheAndPing;
