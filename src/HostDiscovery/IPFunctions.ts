type IPAddress = string;
type IPAddressNumerical = number;

export interface IPNetwork {
	ip: IPAddress,
	prefix: number
}

/**
 * IPv4 helper functions class.
 */
export class IPFunctions {
	// TODO: Test
	private constructor() {}

	static getNumericalIP(ip: IPAddress): IPAddressNumerical {
		const parts: string[] = ip.split(".");
		let result: number = 0;
		for (let i = 0; i < 4; i++) {
			result = (result | (parseInt(parts[i]) << ((3 - i) * 8))) >>> 0;
		}
		return result;
	}

	static getStringIP(ip: IPAddressNumerical): IPAddress {
		const result: number[] = [0, 0, 0, 0];
		for (let i = 0; i < 4; i++) {
			const shift = ((3 - i) * 8);
			result[i] = (ip & (0xFF << shift)) >>> shift;
		}
		return result.join(".");
	}

	static getSubnetMask(prefix: number): IPAddressNumerical {
		return (0xFFFFFFFF << (32 - prefix)) >>> 0;
	}

	static getCleanNetworkAddress(ip: IPAddressNumerical, subnetMask: IPAddressNumerical): IPAddressNumerical {
		return (ip & subnetMask) >>> 0;
	}

	static getFirstAddress(ipNetwork: IPNetwork): IPAddressNumerical {
		const subnetMask = this.getSubnetMask(ipNetwork.prefix);
		const networkIP = this.getCleanNetworkAddress(this.getNumericalIP(ipNetwork.ip), subnetMask);

		// If ipNetwork.prefix == 32, the only host address is the net address.
		// If ipNetwork.prefix == 31, the first host address is the net address.
		// If ipNetwork.prefix <= 30, the first host address is the IP address after the net address.
		let ipFirst = networkIP;
		if (ipNetwork.prefix <= 30) {
			ipFirst++;
		}

		return ipFirst;
	}

	static getLastAddress(ipNetwork: IPNetwork): IPAddressNumerical {
		const subnetMask = this.getSubnetMask(ipNetwork.prefix);
		const networkIP = this.getCleanNetworkAddress(this.getNumericalIP(ipNetwork.ip), subnetMask);

		const subnetMaskInverted = (~subnetMask) >>> 0;

		// If ipNetwork.prefix == 32, the only host address is the net address.
		// If ipNetwork.prefix == 31, the last host address is the last address in the address space.
		// If ipNetwork.prefix <= 30, the last host address is the IP address before the last address
		// in the address space (which is the broadcast address).
		let ipLast = (networkIP | subnetMaskInverted) >>> 0;
		if (ipNetwork.prefix <= 30) {
			ipLast--;
		}

		return ipLast;
	}
}
