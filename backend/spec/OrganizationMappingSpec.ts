import "jasmine";

import Database from "../src/Database/Database";
import OrganizationMapping from "../src/OrganizationMapping/OrganizationMapping"

const timeout: number = 120; // in seconds

describe("OrganizationMapping", () => {
	let originalTimeout: number;
	let organizationMapping: OrganizationMapping;

	beforeEach(() => {
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout * 1000;

		const database = new Database();
		organizationMapping = new OrganizationMapping(database);
	});

	afterEach(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});

	it("should update the IAB and OUI list", async () => {
		await organizationMapping.updateIABList();
		await organizationMapping.updateOUIList();
		const initialized = await organizationMapping.isDBInitialized();
		expect(initialized).toBeTrue();
	});
});
