import "jasmine";

import ARPCacheAndPing from "../src/HostDiscovery/ARPCacheAndPing"
import { IPNetwork } from "../src/HostDiscovery/HostDiscovery"

describe("ARPCacheAndPing", () => {
	let arpCacheAndPing: ARPCacheAndPing | null = null;
	let ipSubnet: IPNetwork | null = null;

	beforeEach(() => {
		arpCacheAndPing = new ARPCacheAndPing();

		ipSubnet = {
			ip: "192.168.188.0",
			prefix: 24
		};
	});

	it("should calculate the subnet mask", () => {
		if (!arpCacheAndPing || !ipSubnet) {
			fail();
		}
		expect(arpCacheAndPing!.getSubnetMask(ipSubnet!.prefix)).toEqual(0xFFFFFF00);
	});
});
