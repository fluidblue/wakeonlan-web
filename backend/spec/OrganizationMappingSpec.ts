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

	it("should return an IAB organization name", async () => {
		const organization = await organizationMapping.getOrganizationName("00:50:C2:7D:50:01");
		expect(organization).toBeDefined();
		expect(organization).toEqual("DEUTA-WERKE GmbH");
	});

	it("should return an OUI organization name", async () => {
		const organization = await organizationMapping.getOrganizationName("00:22:72:00:00:01");
		expect(organization).toBeDefined();
		expect(organization).toEqual("American Micro-Fuel Device Corp.");
	});
});
