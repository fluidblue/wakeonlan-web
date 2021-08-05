import { HostNaming } from "./HostNaming";
import dns from "dns";
//import network from "network"; // TODO

export class DNSNaming implements HostNaming {
	async getHostNameByIP(ip: string): Promise<string | null> {
		return new Promise<string | null>((resolve, reject) => {
			dns.reverse(ip, function(err, hostnames) {
				if (err) {
					reject(new Error(err.toString()));
					return;
				}
				if (!hostnames || !hostnames.length || hostnames.length === 0) {
					resolve(null);
					return;
				}
				// Return first hostname
				resolve(hostnames[0]);
			});
		});
	}
}
