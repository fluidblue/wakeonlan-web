#!/usr/bin/env node

/*!
 * ==================================================================
 * 
 * wakeonlan-web
 * 
 * Created by Max Geissler
 * License: See LICENSE.md in the root directory of this repository.
 * 
 * ==================================================================
 */

import dgram from "dgram";
import net from "net";

import { MACFunctions } from "../HostDiscovery/MACFunctions"

const WAKE_ON_LAN_DEFAULT_PORT: number = 9;

const MAGIC_PACKET_OFFSET: number = 6;
const MAGIC_PACKET_MAC_REPETITIONS: number = 16;
const MAGIC_PACKET_LENGTH: number = MAGIC_PACKET_OFFSET + MAGIC_PACKET_MAC_REPETITIONS * MACFunctions.MAC_ADDR_LENGTH;

const BROADCAST_ADDRESS_IP4: string = "255.255.255.255";

type Protocol = "udp4" | "udp6";

function createMagicPacket(macAddress: Uint8Array): Uint8Array {
	let magicPacket: Uint8Array = Buffer.alloc(MAGIC_PACKET_LENGTH, "FF", "hex");
	for (let i = 0; i < MAGIC_PACKET_MAC_REPETITIONS; i++) {
		for (let j = 0; j < MACFunctions.MAC_ADDR_LENGTH; j++) {
			magicPacket[MAGIC_PACKET_OFFSET + i * MACFunctions.MAC_ADDR_LENGTH + j] = macAddress[j]
		}
	}
	return magicPacket;
}

/**
 * Wakes up a host using Wake-on-LAN.
 * 
 * Details on Wake-on-LAN:
 * https://www.amd.com/system/files/TechDocs/20213.pdf
 */
function wake(macAddress: Uint8Array, port: number = WAKE_ON_LAN_DEFAULT_PORT, address: string = BROADCAST_ADDRESS_IP4, protocol?: Protocol) {
	let checkIP = net.isIP(address);
	if (!checkIP) {
		throw new Error("IP address not valid");
	}
	if (!protocol) {
		if (checkIP == 6) {
			protocol = "udp6";
		} else {
			protocol = "udp4";
		}
	}

	const magicPacket: Uint8Array = createMagicPacket(macAddress);

	const socket = dgram.createSocket({
		type: protocol,
	});

	socket.on("error", (err) => {
		console.log(err);
	});

	socket.connect(port, address, () => {
		// Set SO_BROADCAST socket option to allow sending to a broadcast address
		socket.setBroadcast(true);

		socket.send(magicPacket, 0, magicPacket.length, (err) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Message has been sent.")
			}
			socket.close();
		});
	});
}

function main() {
	const destinationMacAddress: Uint8Array = Buffer.alloc(MACFunctions.MAC_ADDR_LENGTH, "001FD0DB55A2", "hex");
	const destinationPort: number = WAKE_ON_LAN_DEFAULT_PORT;

	wake(destinationMacAddress);
	wake(destinationMacAddress, 7);
	wake(destinationMacAddress, 9, "192.168.188.22");
}

main();
