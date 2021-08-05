import "jasmine";

import { DNSNaming } from "../src/HostNaming/DNSNaming";

const ip: string = "127.0.0.1";

describe("DNSNaming", () => {
	let dnsNaming: DNSNaming = new DNSNaming();

	beforeEach(() => {
		dnsNaming = new DNSNaming();
	});

	it("should resolve " + ip, async () => {
		const result = await dnsNaming.getHostNameByIP(ip);
		expect(result).toEqual(null);
	});
});
