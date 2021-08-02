export class MACFunctions {
	static readonly MAC_ADDR_LENGTH: number = 6;

	private constructor() {}

	static getByteArrayFromMacAddress(mac: string): Uint8Array {
		const result: Uint8Array = Buffer.alloc(this.MAC_ADDR_LENGTH);
		const macParts = mac.split(/\:|\-/);
		for (let i = 0; i < macParts.length; i++) {
			result[i] = parseInt(macParts[i], 16);
		}
		return result;
	}
}
