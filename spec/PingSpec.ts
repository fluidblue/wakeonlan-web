import "jasmine";

import { Ping } from "../src/HostDiscovery/Ping";

describe("Ping", () => {
	it("should ping 127.0.0.1", async () => {
		await Ping.ping("127.0.0.1");
	});
});
