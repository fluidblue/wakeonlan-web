export type MacAddress = string;
export type MacAddressBytes = Uint8Array;

export class MACFunctions {
	static readonly MAC_ADDR_LENGTH: number = 6;

	private constructor() {}

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
			result += byteArray[i].toString(16); // TODO: Print in format "00"
		}
		return result;
	}
}
