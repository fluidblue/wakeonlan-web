import "jasmine";

import ARPCacheAndPing from "../src/HostDiscovery/ARPCacheAndPing"
import { IPNetwork } from "../src/HostDiscovery/IPFunctions"

describe("ARPCacheAndPing", () => {
	let arpCacheAndPing: ARPCacheAndPing = new ARPCacheAndPing();

	beforeEach(() => {
		arpCacheAndPing = new ARPCacheAndPing();
	});

	it("should check if the method is available", async () => {
		const result = await arpCacheAndPing.isAvailable();
	});

	it("should discover hosts", (done) => {
		let ipSubnet: IPNetwork = {
			ip: "192.168.188.0",
			prefix: 28
		}

		arpCacheAndPing.isAvailable().then((methodIsAvailable) => {
			if (!methodIsAvailable) {
				done();
				return;
			}

			arpCacheAndPing.discover(
				ipSubnet,
				(done, total) => {
					const percentage: number = (done * 100.0) / total;
					console.log("Progress: " + done + "/" + total + " (" + percentage + " %)")
				},
				(ipAddress, macAddress) => {
					console.log("Host found: " + macAddress + " " + ipAddress);
				}
			).then(() => {
				console.log("Finished");
				done();
			});
		});
	});
});
