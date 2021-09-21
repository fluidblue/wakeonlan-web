import Database from "../Database/Database";

export default class OrganizationMapping {
	private database: Database;

	constructor(database: Database) {
		this.database = database;
		async function init() {
			if (!await database.organizationMappingInitialized()) {
				await database.organizationMappingIABUpdate();
				await database.organizationMappingOUIUpdate();
			}
		}
		init();
	}

	getOrganizationName(mac: string): Promise<string | null> {
		let organization = this.database.organizationMappingIABGet(mac);
		if (!organization) {
			organization = this.database.organizationMappingOUIGet(mac);
		}
		return organization;
	}
}
