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

const MAC_ADDR_LENGTH: number = 6;

const MAGIC_PACKET_OFFSET: number = 6;
const MAGIC_PACKET_MAC_REPETITIONS: number = 16;
const MAGIC_PACKET_LENGTH: number = MAGIC_PACKET_OFFSET + MAGIC_PACKET_MAC_REPETITIONS * MAC_ADDR_LENGTH;

const destinationMacAddress: Uint8Array = Buffer.alloc(MAC_ADDR_LENGTH, "001FD0DB55A2", "hex");
const destinationPort: number = 9;

const broadcastAddress: string = "255.255.255.255"; // TODO: When powered on, may use 192.168.188.22 for testing

type Protocol = "udp4" | "udp6";

function createMagicPacket(macAddress: Uint8Array): Uint8Array {
	let magicPacket: Uint8Array = Buffer.alloc(MAGIC_PACKET_LENGTH, "FF", "hex");
	for (let i = 0; i < MAGIC_PACKET_MAC_REPETITIONS; i++) {
		for (let j = 0; j < MAC_ADDR_LENGTH; j++) {
			magicPacket[MAGIC_PACKET_OFFSET + i * MAC_ADDR_LENGTH + j] = macAddress[j]
		}
	}
	return magicPacket;
}

function wake(port: number, address?: string, protocol?: Protocol) {
	if (!protocol) {
		protocol = "udp4"; // TODO: Infer default protocol from socket creation, if possible
	}
	if (!address) {
		address = broadcastAddress; // TODO: Adapt to IPv6
	}

	const magicPacket: Uint8Array = createMagicPacket(destinationMacAddress);

	const socket = dgram.createSocket({
		type: protocol,
	});

	socket.once("listening", () => {
		// Set SO_BROADCAST socket option to allow sending to a broadcast address
		socket.setBroadcast(true);
	});

	socket.send(magicPacket, 0, magicPacket.length, port, address, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Message has been sent.")
		}
		socket.close();
	});
}

function main() {
	wake(destinationPort);
}

main();
