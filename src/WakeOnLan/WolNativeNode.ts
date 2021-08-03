import { MACFunctions, MacAddressBytes } from "../HostDiscovery/MACFunctions"
import { WakeOnLan, WakeOnLanOptions } from "./WakeOnLan";
import dgram from "dgram";
import net from "net";

export class WolNativeNode extends WakeOnLan {
	static readonly MAGIC_PACKET_OFFSET: number = 6;
	static readonly MAGIC_PACKET_MAC_REPETITIONS: number = 16;
	static readonly MAGIC_PACKET_LENGTH: number = WolNativeNode.MAGIC_PACKET_OFFSET + WolNativeNode.MAGIC_PACKET_MAC_REPETITIONS * MACFunctions.MAC_ADDR_LENGTH;

	static createMagicPacket(macAddress: MacAddressBytes): Uint8Array {
		let magicPacket: Uint8Array = Buffer.alloc(WolNativeNode.MAGIC_PACKET_LENGTH, "FF", "hex");
		for (let i = 0; i < WolNativeNode.MAGIC_PACKET_MAC_REPETITIONS; i++) {
			for (let j = 0; j < MACFunctions.MAC_ADDR_LENGTH; j++) {
				magicPacket[WolNativeNode.MAGIC_PACKET_OFFSET + i * MACFunctions.MAC_ADDR_LENGTH + j] = macAddress[j]
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
	async wake(macAddress: MacAddressBytes, options?: WakeOnLanOptions, protocol?: dgram.SocketType): Promise<void> {
		// Merge options and defaultOptions
		options = {...WakeOnLan.optionsDefault, ...options};

		let checkIP = net.isIP(options.address!);
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

		const magicPacket: Uint8Array = WolNativeNode.createMagicPacket(macAddress);

		const promise = new Promise<void>((resolve, reject) => {
			const socket = dgram.createSocket({
				type: protocol!
			});

			socket.on("error", (err) => {
				reject(err);
			});

			socket.connect(options!.port!, options!.address, () => {
				// Set SO_BROADCAST socket option to allow sending to a broadcast address
				socket.setBroadcast(true);

				socket.send(magicPacket, 0, magicPacket.length, (err) => {
					socket.close();
					if (err) {
						reject(err);
						return;
					}
					console.log("Message has been sent.");
					resolve();
				});
			});
		});
		await promise;
	}
}

async function main() {
	const destinationMacAddress: MacAddressBytes = Buffer.alloc(MACFunctions.MAC_ADDR_LENGTH, "001FD0DB55A2", "hex");
	const wakeOnLan = new WolNativeNode();

	await wakeOnLan.wake(destinationMacAddress);

	await wakeOnLan.wake(destinationMacAddress, {
		port: 7
	});

	await wakeOnLan.wake(destinationMacAddress, {
		port: 9,
		address: "192.168.188.22"
	});
}

main();
