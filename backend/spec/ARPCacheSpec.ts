import "jasmine";

import { ARPCache } from "../src/HostDiscovery/ARPCache";

describe("ARPCache", () => {
	it("should retrieve the ARP cache", async () => {
		const arpCache = await ARPCache.getARPCache();
	});
});
