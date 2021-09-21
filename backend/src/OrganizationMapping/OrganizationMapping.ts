import fetch from "node-fetch";

import Database from "../Database/Database";

const URI_OUI = "http://standards-oui.ieee.org/oui/oui.txt";
const URI_IAB = "http://standards-oui.ieee.org/iab/iab.txt";

export default class OrganizationMapping {
	private database: Database;

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
