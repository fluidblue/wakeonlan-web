import "jasmine";

import Database from "../src/Database/Database";
import OrganizationMapping from "../src/OrganizationMapping/OrganizationMapping"

describe("OrganizationMapping", () => {
	let organizationMapping: OrganizationMapping;

	beforeEach(() => {
		const database = new Database();
		organizationMapping = new OrganizationMapping(database);
	});

	it("should update the IAB and OUI list", async () => {
		await organizationMapping.updateIABList();
		await organizationMapping.updateOUIList();
		const initialized = await organizationMapping.isDBInitialized();
		expect(initialized).toBeTrue();
	});
});
