import "jasmine";

import { MACFunctions } from "../src/MACFunctions"

describe("MACFunctions", () => {
	it("should validate MACs", () => {
		expect(MACFunctions.isValidMac("00:11:22:33:44:55")).toBeTrue();
		expect(MACFunctions.isValidMac("0:11:22:33:44:55")).toBeTrue();
		expect(MACFunctions.isValidMac("AA:11:22:33:44:66")).toBeTrue();
		expect(MACFunctions.isValidMac("aa:11:22:33:44:66")).toBeTrue();

		expect(MACFunctions.isValidMac("0011:22:33:44:55")).toBeFalse();
	});
});
