import "jasmine";

import ARPCacheAndPing from "../src/HostDiscovery/ARPCacheAndPing"
import { IPNetwork } from "../src/HostDiscovery/HostDiscovery"

describe("ARPCacheAndPing", () => {
	let arpCacheAndPing: ARPCacheAndPing = new ARPCacheAndPing();

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

	beforeEach(() => {
		arpCacheAndPing = new ARPCacheAndPing();
	});

	for (let i = 0; i < tests.length; i++) {
		let ipSubnet = tests[i].in.ipSubnet;
		let subnetMaskResult = tests[i].out.subnetMask;
		let numericalIPAddress = tests[i].out.numericalIPAddress;

		it("should calculate the subnet mask", () => {
			expect(arpCacheAndPing.getSubnetMask(ipSubnet.prefix)).toEqual(subnetMaskResult);
		});

		it("should convert IP addresses to numbers", () => {
			let ip: number = arpCacheAndPing.getNumberFromIP(ipSubnet.ip);
			expect(ip).toEqual(numericalIPAddress);
		});

		it("should convert numbers to IP addresses", () => {
			let ip: string = arpCacheAndPing.getIPFromNumber(numericalIPAddress);
			expect(ip).toEqual(ipSubnet.ip);
		});
	}

	it("should ping 127.0.0.1", (done) => {
		arpCacheAndPing.ping("127.0.0.1", (error) => {
			if (error) {
				fail();
				return;
			}
			done();
		});
	});

	it("should check if the method is available", (done) => {
		arpCacheAndPing.isAvailable((res) => {
			expect(res).toBeDefined();
			expect(res).toEqual(!null);
			done();
		});
	});

	it("should discover hosts", (done) => {
		let ipSubnet: IPNetwork = {
			ip: "192.168.189.0",
			prefix: 28
		}

		arpCacheAndPing.isAvailable((res) => {
			if (!res) {
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
