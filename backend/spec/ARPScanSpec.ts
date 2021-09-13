import "jasmine";

import ARPScan from "../src/HostDiscovery/ARPScan"
import { IPNetwork, MACFunctions } from "wakeonlan-utilities"

const verbose: boolean = false;
const timeout: number = 120; // in seconds

describe("ARPScan", () => {
	let originalTimeout: number;
	let arpScan: ARPScan = new ARPScan();

	beforeEach(() => {
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout * 1000;

		arpScan = new ARPScan();
	});

	it("should check if the method is available", async () => {
		const result = await arpScan.isAvailable();
	});

	it("should discover hosts", async () => {
		let ipSubnet: IPNetwork = {
			ip: "192.168.188.0",
			prefix: 24
		}

		const methodIsAvailable = await arpScan.isAvailable();
		if (!methodIsAvailable) {
			return;
		}

		if (verbose) {
			console.log(""); // Add newline
		}

		const hosts = await arpScan.discover(
			ipSubnet,
			(done, total) => {
				if (verbose) {
					const percentage: number = (done * 100.0) / total;
					console.log("Progress: " + done + "/" + total + " (" + percentage + " %)")
				}
			},
			(ipAddress, macAddress) => {
				if (verbose) {
					const macAddressString = MACFunctions.getMacAddressFromByteArray(macAddress);
					console.log("Host found: " + macAddressString + " " + ipAddress);
				}
			}
		);
		if (verbose) {
			console.log("Finished.");
			console.log("Hosts:");
			console.log(hosts);
		}
	});

	afterEach(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});
});
