import fetch from "node-fetch";

import Database from "../Database/Database";

const URI_OUI = "http://standards-oui.ieee.org/oui/oui.txt";
const URI_IAB = "http://standards-oui.ieee.org/iab/iab.txt";

export interface IABEntry {
	organization: string;
	mac_part1: string;
	mac_part2_range_start: string;
	mac_part2_range_end: string;
}

export interface OUIEntry {
	organization: string;
	mac_part1: string;
}

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
	private static readonly RE_IAB = /([0-9A-Za-z]{1,2}(?:-[0-9A-Za-z]{1,2}){2})\s*\(hex\)\s*(.*)\r\n([0-9A-Za-z]{6})-([0-9A-Za-z]{6})\s*\(base 16\)/g;

	/**
	 * Matches entries in an OUI file.
	 * 
	 * Capturing groups:
	 * Group 1: mac_part1
	 * Group 2: organization
	 */
	private static readonly RE_OUI = /([0-9A-Za-z]{1,2}(?:-[0-9A-Za-z]{1,2}){2})\s*\(hex\)\s*(.*)\r\n/g;

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

	private iabRangeConvert(range: string): string {
		return range.substr(0, 2) + "-" + range.substr(2, 2) + "-" + range.substr(4, 2);
	}

	async updateIABList(): Promise<boolean> {
		const response = await fetch(URI_IAB);
		if (!response) {
			return false;
		}
		const text = await response.text();
		if (!text) {
			return false;
		}

		const iabMapping: IABEntry[] = [];
		const iterable = text.matchAll(OrganizationMapping.RE_IAB);
		for (const entry of iterable) {
			iabMapping.push({
				organization: entry[2].trim(),
				mac_part1: entry[1],
				mac_part2_range_start: this.iabRangeConvert(entry[3]),
				mac_part2_range_end: this.iabRangeConvert(entry[4])
			});
		}
		if (iabMapping.length === 0) {
			return false;
		}

		return await this.database.organizationMappingIABUpdate(iabMapping);
	}

	async updateOUIList(): Promise<boolean> {
		const response = await fetch(URI_OUI);
		if (!response) {
			return false;
		}
		const text = await response.text();
		if (!text) {
			return false;
		}

		const ouiMapping: OUIEntry[] = [];
		const iterable = text.matchAll(OrganizationMapping.RE_OUI);
		for (const entry of iterable) {
			ouiMapping.push({
				organization: entry[2],
				mac_part1: entry[1]
			});
		}
		if (ouiMapping.length === 0) {
			return false;
		}

		return await this.database.organizationMappingOUIUpdate(ouiMapping);
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
