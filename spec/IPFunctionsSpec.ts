import "jasmine";

import { IPFunctions } from "../src/HostDiscovery/IPFunctions"

describe("IPFunctions", () => {
	const tests = [
		{
			in: {
				ipSubnet: {
					ip: "192.168.188.0",
					prefix: 24
				}
			},
			out: {
				subnetMask: 0xFFFFFF00,
				numericalIPAddress: 3232283648,
				firstIPAddress: "192.168.188.1",
				lastIPAddress: "192.168.188.254"
			}
		},
		{
			in: {
				ipSubnet: {
					ip: "192.168.188.123",
					prefix: 32
				}
			},
			out: {
				subnetMask: 0xFFFFFFFF,
				numericalIPAddress: 3232283771,
				firstIPAddress: "192.168.188.123",
				lastIPAddress: "192.168.188.123"
			}
		},
		{
			in: {
				ipSubnet: {
					ip: "192.168.188.0", // Faulty notation for the network part.
					prefix: 16
				}
			},
			out: {
				subnetMask: 0xFFFF0000,
				numericalIPAddress: 3232283648,
				firstIPAddress: "192.168.0.1",
				lastIPAddress: "192.168.255.254"
			}
		},
		{
			in: {
				ipSubnet: {
					ip: "192.168.188.0",
					prefix: 32
				}
			},
			out: {
				subnetMask: 0xFFFFFFFF,
				numericalIPAddress: 3232283648,
				firstIPAddress: "192.168.188.0",
				lastIPAddress: "192.168.188.0"
			}
		},
		{
			in: {
				ipSubnet: {
					ip: "192.168.0.0",
					prefix: 16
				}
			},
			out: {
				subnetMask: 0xFFFF0000,
				numericalIPAddress: 3232235520,
				firstIPAddress: "192.168.0.1",
				lastIPAddress: "192.168.255.254"
			}
		},
		{
			in: {
				ipSubnet: {
					ip: "10.0.0.0",
					prefix: 8
				}
			},
			out: {
				subnetMask: 0xFF000000,
				numericalIPAddress: 167772160,
				firstIPAddress: "10.0.0.1",
				lastIPAddress: "10.255.255.254"
			}
		}
	]

	for (let i = 0; i < tests.length; i++) {
		let ipSubnet = tests[i].in.ipSubnet;
		let subnetMaskResult = tests[i].out.subnetMask;
		let numericalIPAddress = tests[i].out.numericalIPAddress;
		let firstAddress = tests[i].out.firstIPAddress;
		let lastAddress = tests[i].out.lastIPAddress;

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
