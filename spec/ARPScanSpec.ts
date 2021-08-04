import "jasmine";

import ARPScan from "../src/HostDiscovery/ARPScan"
import { IPNetwork } from "../src/HostDiscovery/IPFunctions"
import { MACFunctions } from "../src/HostDiscovery/MACFunctions"

describe("ARPScan", () => {
	let originalTimeout: number;
	let arpScan: ARPScan = new ARPScan();

	beforeEach(() => {
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

		arpScan = new ARPScan();
	});

	it("should check if the method is available", async () => {
		const result = await arpScan.isAvailable();
	});

	it("should discover hosts", async () => {
		let ipSubnet: IPNetwork = {
			ip: "192.168.188.0",
			prefix: 20
		}

		const methodIsAvailable = await arpScan.isAvailable();
		if (!methodIsAvailable) {
			return;
		}

		const hosts = await arpScan.discover(
			ipSubnet,
			(done, total) => {
				const percentage: number = (done * 100.0) / total;
				console.log("Progress: " + done + "/" + total + " (" + percentage + " %)")
			},
			(ipAddress, macAddress) => {
				const macAddressString = MACFunctions.getMacAddressFromByteArray(macAddress);
				console.log("Host found: " + macAddressString + " " + ipAddress);
			}
		);
		console.log("Finished");
		console.log("Hosts:");
		console.log(hosts);
	});

	afterEach(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});
});
