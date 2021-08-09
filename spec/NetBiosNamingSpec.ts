import "jasmine";

import { NetBiosNaming } from "../src/HostNaming/NetBiosNaming";

describe("NetBiosNaming", () => {
	let netBiosNaming: NetBiosNaming = new NetBiosNaming();

	beforeEach(() => {
		netBiosNaming = new NetBiosNaming();
	});

	it("should process a macOS raw output", async () => {
		const rawOutput =
			"Using IP address of 192.168.188.28: 192.168.188.28\n" +
			"NetBIOS Name                     Number  Type    Description\n" +
			"NAME                             0x00    UNIQUE  [Workstation Service]\n" +
			"NAME                             0x03    UNIQUE  [Messenger Service]\n" +
			"NAME                             0x20    UNIQUE  [File/Print Server Service]\n" +
			"%01%02__MSBROWSE__%02            0x01    GROUP   [Master Browser]\n" +
			"MSHEIMNETZ                       0x00    GROUP   [Domain Name]\n" +
			"MSHEIMNETZ                       0x1d    UNIQUE  [Master Browser]\n" +
			"MSHEIMNETZ                       0x1e    GROUP   [Browser Service Elections]\n";

		const result = netBiosNaming.parseOnMac(rawOutput);
		expect(result).toBe("NAME");
	});

	it("should process a linux raw output", async () => {
		const rawOutput =
			"Looking up status of 192.168.188.28\n" +
			"	NAME            <00> -         B <ACTIVE> \n" +
			"	NAME            <03> -         B <ACTIVE> \n" +
			"	NAME            <20> -         B <ACTIVE> \n" +
			"	..__MSBROWSE__. <01> - <GROUP> B <ACTIVE> \n" +
			"	MSHEIMNETZ      <00> - <GROUP> B <ACTIVE> \n" +
			"	MSHEIMNETZ      <1d> -         B <ACTIVE> \n" +
			"	MSHEIMNETZ      <1e> - <GROUP> B <ACTIVE> \n" +
			"\n" +
			"	MAC Address = 00-00-00-00-00-00\n" +
			"\n";

		const result = netBiosNaming.parseOnLinux(rawOutput);
		expect(result).toBe("NAME");
	});

	it("should resolve 127.0.0.1", async () => {
		await netBiosNaming.getHostNameByIP("127.0.0.1");
	});
});
