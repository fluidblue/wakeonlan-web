import "jasmine";

import Database, { Host, SettingsData } from "../src/Database/Database"

describe("Database", () => {
	let database: Database;

	beforeEach(() => {
		database = new Database();
	});

	it("should get the settings", async () => {
		const settingsData: SettingsData = await database.settingsGet();
		expect(settingsData.wolPort).toBeDefined();
		expect(settingsData.autoDetectNetworks).toBeDefined();
		expect(settingsData.ipNetworks).toBeDefined();
		expect(settingsData.ipNetworks.length).toBeDefined();
	});

	it("should get saved hosts", async () => {
		const savedHosts: Host[] = await database.savedHostsGet();

		for (const host of savedHosts) {
			expect(host.name).toBeDefined();
			expect(host.mac).toBeDefined();
		}
	});

	it("should add and remove a host", async () => {
		let result: boolean = await database.savedHostsAdd({
			name: "Hostname",
			mac: "00:11:22:33:44:55"
		});
		expect(result).toBeTrue();

		result = await database.savedHostsDelete("00:11:22:33:44:55");
		expect(result).toBeTrue();
	});
});
