import "jasmine";

import WolNativeNode from "../src/WakeOnLan/WolNativeNode"
import { MACFunctions, MacAddressBytes } from "wakeonlan-utilities"

describe("WolNativeNode", () => {
	const destinationMacAddress: MacAddressBytes = Buffer.alloc(MACFunctions.MAC_ADDR_LENGTH, "001122334455", "hex");

	const defaultPort = 9; // WOL port number
	const alternativePort: number = 7; // Echo protocol port number (also used for WOL sometimes)

	const nonBroadcastAddress: string = "127.0.0.1";

	let wolNativeNode: WolNativeNode = new WolNativeNode();

	beforeEach(() => {
		wolNativeNode = new WolNativeNode();
	});
	
	it(`should send a WOL packet to default port and address`, async () => {
		await wolNativeNode.wake(destinationMacAddress);
	});

	it(`should send a WOL packet to port ${alternativePort} and default address`, async () => {
		await wolNativeNode.wake(destinationMacAddress, {
			port: alternativePort
		});
	});

	it(`should send a WOL packet to port ${defaultPort} and address ${nonBroadcastAddress}`, async () => {
		await wolNativeNode.wake(destinationMacAddress, {
			port: defaultPort,
			address: nonBroadcastAddress
		});
	});
});
