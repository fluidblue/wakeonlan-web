export type MacAddress = string;
export type MacAddressBytes = Uint8Array;

export class MACFunctions {
	static readonly MAC_ADDR_LENGTH: number = 6;
	static readonly RE_MAC: RegExp = /^[0-9a-fA-F]{1,2}(?::[0-9a-fA-F]{1,2}){5}$/;

	private constructor() {}

	static isValidMac(mac: string | null | undefined): boolean {
		if (!mac) {
			return false;
		}
		return this.RE_MAC.test(mac);
	}

	static getByteArrayFromMacAddress(mac: MacAddress): MacAddressBytes {
		const result: Uint8Array = Buffer.alloc(this.MAC_ADDR_LENGTH);
		const macParts = mac.split(/\:|\-/);
		for (let i = 0; i < macParts.length; i++) {
			result[i] = parseInt(macParts[i], 16);
		}
		return result;
	}

	static getMacAddressFromByteArray(byteArray: MacAddressBytes): MacAddress {
		if (byteArray.length !== MACFunctions.MAC_ADDR_LENGTH) {
			throw new RangeError();
		}

		let result = "";
		for (let i = 0; i < byteArray.length; i++) {
			if (i !== 0) {
				result += ":";
			}

			let hex = byteArray[i].toString(16);
			if (hex.length == 1) {
				hex = "0" + hex;
			}

			result += hex;
		}
		return result;
	}
}
