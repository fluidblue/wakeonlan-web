import { HostDiscovery } from "./HostDiscovery"
import { IPFunctions, IPNetwork, MACFunctions, MacAddressBytes } from "wakeonlan-utilities";
import { ARPCacheEntry } from "./ARPCache";
import { spawn, exec } from "child_process";
import net from "net";
import network, { Interface } from "network";

const delimeter: string = "\n";

export default class ARPScan implements HostDiscovery {
	// Matches IP address and MAC address in a result line of the arp-scan command.
	//
	// Note on IP address part: This part of the regular expression is created for extraction, not for validation of IP addresses.
	// Note on MAC address part: Modified from https://stackoverflow.com/a/4260512/2013757
	private static readonly RE_ARP_SCAN_RESULT: RegExp = /^((?:[0-9]{1,3}\.){3}(?:[0-9]{1,3})){1}.*?((?:[0-9A-Fa-f]{1,2}[:-]){5}(?:[0-9A-Fa-f]{1,2}))$/;

	async discover(
		ipSubnet: IPNetwork,
		callbackProgress?: (done: number, total: number) => void,
		callbackHostFound?: (ipAddress: string, macAddress: MacAddressBytes) => void
	): Promise<ARPCacheEntry[]> {
		// Check for valid input
		if (!net.isIP(ipSubnet.ip)) {
			throw new Error("Invalid input.");
		}

		// Normalize IP network address
		let numericalIP = IPFunctions.getNumericalIP(ipSubnet.ip);
		numericalIP = IPFunctions.getCleanNetworkAddress(numericalIP, IPFunctions.getSubnetMask(ipSubnet.prefix));
		const ip = IPFunctions.getStringIP(numericalIP);

		const hosts: ARPCacheEntry[] = [];
		let failed: boolean = false;

		function addHost(ip: string, mac: string) {
			hosts.push({
				ip: ip,
				mac: mac
			});
			if (callbackHostFound) {
				callbackHostFound(ip, MACFunctions.getByteArrayFromMacAddress(mac));
			}
		}

		// Retrieve own IP and MAC
		const iface = await new Promise<Interface>((resolve, reject) => {
			network.get_active_interface((err, obj) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(obj!);
			});
		});
		addHost(iface.ip_address, iface.mac_address);

		const promise = new Promise<void>((resolve, reject) => {
			const childProcess = spawn("arp-scan", ["-q", "-x", "-g", `${ip}/${ipSubnet.prefix}`]);

			childProcess.on("error", (err) => {
				failed = true;
				reject(new Error("Failed to start subprocess. Caused by: " + err.toString()));
			});

			childProcess.stdout.on("data", this.createChunkAssembler((line) => {
				const result = line.match(ARPScan.RE_ARP_SCAN_RESULT);
				if (!result) {
					failed = true;
					childProcess.kill();
					reject(new Error("Unexpected output format. Output format should be: \"123.123.123.123\\t00:11:22:33:44:55\""));
				}
				const ip = result![1];
				const mac = result![2];
				addHost(ip, mac);
			}));

			childProcess.stderr.on("data", this.createChunkAssembler((line) => {
				failed = true;
				childProcess.kill();
				reject(new Error(line));
			}));

			childProcess.on("close", (code) => {
				if (failed) {
					// Error has already been handled.
					return;
				}
				if (code !== 0) {
					reject(new Error("Child process exited with code " + code + "."));
					return;
				}
				resolve();
			});
		});
		await promise;

		if (callbackProgress) {
			// TODO: Use callbackProgress during arp-scan running
			const totalIPs = IPFunctions.getLastAddress(ipSubnet) - IPFunctions.getFirstAddress(ipSubnet) + 1;
			callbackProgress(totalIPs, totalIPs);
		}

		return hosts;
	}

	createChunkAssembler(callback: (line: string) => void) {
		let lastChunk: string = "";
		return function(data: any) {
			const dataChunks = data.toString().split(delimeter);
			if (dataChunks.length > 0) {
				dataChunks[0] = lastChunk + dataChunks[0];
				lastChunk = dataChunks.pop()!;
			}
			for (let line of dataChunks) {
				callback(line);
			}
		}
	}

	async isAvailable(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			exec("arp-scan 127.0.0.1/32", (error, stdout, stderr) => {
				if (error) {
					resolve(false);
					return;
				}
				if (stderr && stderr.length > 0) {
					resolve(false);
					return;
				}
				resolve(true);
			});
		});
	}
}
