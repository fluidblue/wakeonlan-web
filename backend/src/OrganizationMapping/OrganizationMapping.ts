import fetch from "node-fetch";

import Database from "../Database/Database";

const URI_OUI = "http://standards-oui.ieee.org/oui/oui.txt";
const URI_IAB = "http://standards-oui.ieee.org/iab/iab.txt";

export default class OrganizationMapping {
	private database: Database;

	/**
	 * Matches entries in an IAB file.
	 * 
	 * Capturing groups:
	 * Group 1: mac_part1
	 * Group 2: organization (untrimmed)
	 * Group 3: mac_part2_range_start
	 * Group 4: mac_part2_range_end
	 */
	private static readonly RE_IAB = /([0-9A-Za-z]{1,2}(?:-[0-9A-Za-z]{1,2}){2})\s*\(hex\)\s*(.*)\n([0-9A-Za-z]{6})-([0-9A-Za-z]{6})\s*\(base 16\)/g;

	/**
	 * Matches entries in an OUI file.
	 * 
	 * Capturing groups:
	 * Group 1: mac_part1
	 * Group 2: organization
	 */
	private static readonly RE_OUI = /([0-9A-Za-z]{1,2}(?:-[0-9A-Za-z]{1,2}){2})\s*\(hex\)\s*(.*)\n/g;

	constructor(database: Database) {
		this.database = database;

		const that = this;
		async function init() {
			if (!await that.isDBInitialized()) {
				await that.updateIABList();
				await that.updateOUIList();
			}
		}
		init();
	}

	async updateIABList() {
		// TODO
	}

	async updateOUIList() {
		// TODO
	}

	async isDBInitialized(): Promise<boolean> {
		return await this.database.organizationMappingInitialized();
	}

	async getOrganizationName(mac: string): Promise<string | null> {
		let organization = await this.database.organizationMappingIABGet(mac);
		if (!organization) {
			organization = await this.database.organizationMappingOUIGet(mac);
		}
		return organization;
	}
}
