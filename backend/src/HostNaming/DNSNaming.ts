import { HostNaming } from "./HostNaming";
import dns from "dns";
import network from "network";

export class DNSNaming implements HostNaming {
	async getHostNameByIP(ip: string): Promise<string | null> {
		let fqdnHost = await this.getFQDNByIP(ip);
		if (!fqdnHost) {
			return null;
		}

		let fqdnGateway = null;
		try {
			const ipGateway = await this.getGatewayIP();
			if (ipGateway && ipGateway !== ip) {
				fqdnGateway = await this.getFQDNByIP(ipGateway);
			}
		}
		catch (error) {
			// Return FQDN as host name
			return fqdnHost;
		}

		if (!fqdnGateway) {
			return fqdnHost;
		}
		if (fqdnHost.endsWith(fqdnGateway)) {
			fqdnHost = fqdnHost.substr(0, fqdnHost.length - fqdnGateway.length);
			if (fqdnHost.endsWith(".") && fqdnHost.length > 1) {
				fqdnHost = fqdnHost.substr(0, fqdnHost.length - 1);
			}
		}
		return fqdnHost;
	}

	async getFQDNByIP(ip: string): Promise<string | null> {
		return new Promise<string | null>((resolve, reject) => {
			dns.reverse(ip, function(err, hostnames) {
				if (err && err.message.startsWith("getHostByAddr ENOTFOUND")) {
					resolve(null);
					return;
				}
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

	async getGatewayIP(): Promise<string | null> {
		return new Promise((resolve, reject) => {
			network.get_gateway_ip((err, ip) => {
				if (err) {
					reject(new Error(err.toString()));
					return;
				}
				if (!ip || ip.length === 0) {
					resolve(null);
					return;
				}
				resolve(ip);
			});
		});
	}
}
