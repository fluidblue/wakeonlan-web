import "jasmine";

import ARPCacheAndPing from "../src/HostDiscovery/ARPCacheAndPing"
import { IPNetwork } from "../src/HostDiscovery/IPFunctions"
import { MACFunctions } from "../src/HostDiscovery/MACFunctions"

describe("ARPCacheAndPing", () => {
	let arpCacheAndPing: ARPCacheAndPing = new ARPCacheAndPing();

	beforeEach(() => {
		arpCacheAndPing = new ARPCacheAndPing();
	});

	it("should check if the method is available", async () => {
		const result = await arpCacheAndPing.isAvailable();
	});

	it("should discover hosts", async () => {
		let ipSubnet: IPNetwork = {
			ip: "192.168.188.0",
			prefix: 26
		}

		const methodIsAvailable = await arpCacheAndPing.isAvailable();
		if (!methodIsAvailable) {
			return;
		}

		await arpCacheAndPing.discover(
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
	});
});
