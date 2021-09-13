import "jasmine";

import { IPFunctions, IPNetwork } from "../src/IPFunctions"

describe("IPFunctions", () => {
	const tests = [
		{
			ipSubnet: {
				ip: "192.168.188.0",
				prefix: 24
			},
			ipSubnetString: "192.168.188.0/24",
			subnetMask: 0xFFFFFF00,
			numericalIPAddress: 3232283648,
			firstIPAddress: "192.168.188.1",
			lastIPAddress: "192.168.188.254"
		},
		{
			ipSubnet: {
				ip: "192.168.188.123",
				prefix: 32
			},
			ipSubnetString: "192.168.188.123/32",
			subnetMask: 0xFFFFFFFF,
			numericalIPAddress: 3232283771,
			firstIPAddress: "192.168.188.123",
			lastIPAddress: "192.168.188.123"
		},
		{
			ipSubnet: {
				ip: "192.168.188.0", // Faulty notation for the network part
				prefix: 16
			},
			ipSubnetString: "192.168.188.0/16", // Faulty notation for the network part
			subnetMask: 0xFFFF0000,
			numericalIPAddress: 3232283648,
			firstIPAddress: "192.168.0.1",
			lastIPAddress: "192.168.255.254"
		},
		{
			ipSubnet: {
				ip: "192.168.188.0",
				prefix: 32
			},
			ipSubnetString: "192.168.188.0/32",
			subnetMask: 0xFFFFFFFF,
			numericalIPAddress: 3232283648,
			firstIPAddress: "192.168.188.0",
			lastIPAddress: "192.168.188.0"
		},
		{
			ipSubnet: {
				ip: "192.168.0.0",
				prefix: 16
			},
			ipSubnetString: "192.168.0.0/16",
			subnetMask: 0xFFFF0000,
			numericalIPAddress: 3232235520,
			firstIPAddress: "192.168.0.1",
			lastIPAddress: "192.168.255.254"
		},
		{
			ipSubnet: {
				ip: "10.0.0.0",
				prefix: 8
			},
			ipSubnetString: "10.0.0.0/8",
			subnetMask: 0xFF000000,
			numericalIPAddress: 167772160,
			firstIPAddress: "10.0.0.1",
			lastIPAddress: "10.255.255.254"
		}
	]

	for (let i = 0; i < tests.length; i++) {
		let ipSubnet = tests[i].ipSubnet;
		let subnetMaskResult = tests[i].subnetMask;
		let numericalIPAddress = tests[i].numericalIPAddress;
		let firstAddress = tests[i].firstIPAddress;
		let lastAddress = tests[i].lastIPAddress;

		it("should calculate the subnet mask", () => {
			expect(IPFunctions.getSubnetMask(ipSubnet.prefix)).toEqual(subnetMaskResult);
		});

		it("should convert IP address strings to numbers", () => {
			let ip = IPFunctions.getNumericalIP(ipSubnet.ip);
			expect(ip).toEqual(numericalIPAddress);
		});

		it("should convert numbers to IP address strings", () => {
			let ip = IPFunctions.getStringIP(numericalIPAddress);
			expect(ip).toEqual(ipSubnet.ip);
		});

		it("should get the first address of an IP network", () => {
			let ipNumerical = IPFunctions.getFirstAddress(ipSubnet);
			let ipString = IPFunctions.getStringIP(ipNumerical);
			expect(ipString).toEqual(firstAddress);
		});

		it("should get the last address of an IP network", () => {
			let ipNumerical = IPFunctions.getLastAddress(ipSubnet);
			let ipString = IPFunctions.getStringIP(ipNumerical);
			expect(ipString).toEqual(lastAddress);
		});
	}
});
