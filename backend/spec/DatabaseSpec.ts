import "jasmine";

import Database from "../src/Database/Database"
import { Host, SettingsData } from "wakeonlan-utilities";

describe("Database", () => {
	let database: Database;

	beforeEach(() => {
		database = new Database();
	});

	it("should put and get the settings", async () => {
		const settingsData: SettingsData = {
			autoDetectNetworks: true,
			ipNetworks: [
				{ ip: "192.168.178.0", prefix: 24 },
				{ ip: "192.168.188.0", prefix: 24 }
			],
			wolPort: 9
		};
		const result = await database.settingsPut(settingsData);
		expect(result).toBeTrue();

		const settingsDataLoaded: SettingsData = await database.settingsGet();
		expect(settingsDataLoaded.wolPort).toEqual(settingsData.wolPort);
		expect(settingsDataLoaded.autoDetectNetworks).toEqual(settingsData.autoDetectNetworks);
		expect(settingsDataLoaded.ipNetworks.length).toEqual(settingsData.ipNetworks.length);
		for (let i = 0; i < settingsDataLoaded.ipNetworks.length; i++) {
			expect(settingsDataLoaded.ipNetworks[i].ip).toEqual(settingsData.ipNetworks[i].ip);
			expect(settingsDataLoaded.ipNetworks[i].prefix).toEqual(settingsData.ipNetworks[i].prefix);
		}
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
