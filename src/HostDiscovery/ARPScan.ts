import { HostDiscovery } from "./HostDiscovery"
import { IPNetwork } from "./IPFunctions";
import { MacAddressBytes } from "./MACFunctions";
import { ARPCacheEntry } from "./ARPCache";
import { spawn } from "child_process";
import net from "net";

const delimeter: string = "\n";

export default class ARPScan implements HostDiscovery {
	async discover(
		ipSubnet: IPNetwork,
		callbackProgress: (done: number, total: number) => void,
		callbackHostFound: (ipAddress: string, macAddress: MacAddressBytes) => void
	): Promise<ARPCacheEntry[]> {
		const hosts: ARPCacheEntry[] = [];

		// Check for valid input, as input is used in string literal
		if (!net.isIP(ipSubnet.ip)) {
			throw new Error("Invalid input.");
		}

		const promise = new Promise<void>((resolve, reject) => {
			const childProcess = spawn("arp-scan", ["-q", `${ipSubnet.ip}/${ipSubnet.prefix}`]);

			childProcess.on("error", (err) => {
				console.error("Failed to start subprocess.");
			});

			childProcess.stdout.on("data", this.createChunkAssembler((line) => {
				console.log("stdout (line): " + line);
			}));

			childProcess.stderr.on("data", this.createChunkAssembler((line) => {
				console.log("stderr (line): " + line);
			}));

			childProcess.on("close", (code) => {
				console.log(`child process exited with code ${code}`);
				resolve();
			});
		});
		await promise;

		// TODO
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
		// TODO
		return true;
	}
}
