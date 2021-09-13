import network, { Interface } from "network";
import { IPNetwork, IPFunctions } from "wakeonlan-utilities";

export class IPNetworks {
	private constructor() {}

	static async getNetworks(): Promise<IPNetwork[]> {
		const ifaces: Interface[] = await new Promise<Interface[]>((resolve, reject) => {
			network.get_interfaces_list(function(err, list) {
				if (err) {
					reject(err);
					return;
				}
				resolve(list!);
			})
		});

		const result: IPNetwork[] = [];
		for (const iface of ifaces) {
			if (!iface || !iface.ip_address || !iface.netmask) {
				continue;
			}

			const numericalIP = IPFunctions.getNumericalIP(iface.ip_address);
			const numericalSubnetMask = IPFunctions.getNumericalIP(iface.netmask);
			const cleanNetworkAddress = IPFunctions.getCleanNetworkAddress(numericalIP, numericalSubnetMask);

			const network: IPNetwork = {
				ip: IPFunctions.getStringIP(cleanNetworkAddress),
				prefix: IPFunctions.getPrefix(numericalSubnetMask)
			};
			result.push(network);
		}
		return result;
	}
}
