import mariadb from "mariadb";
import fs from "fs";

import { Host, SettingsData, settingsDataDefault } from "wakeonlan-utilities";
import Log from "../Log/Log";
import { IABEntry, OUIEntry } from "../OrganizationMapping/OrganizationMapping";

export default class Database {
	private pool: mariadb.Pool;

	constructor() {
		this.pool = mariadb.createPool({
			host: process.env.DATABASE_HOST,
			user: process.env.DATABASE_USER,
			password: this.readPassword(),
			database: process.env.DATABASE_DB,
			connectionLimit: 5
		});
	}

	readPassword(): string {
		let password = fs.readFileSync(process.env.DATABASE_PASSWORD_FILE!, "utf8");

		// Remove trailing newlines.
		// Some editors (e.g. nano, vim, ...) append newlines to files,
		// even if the user did not enter them.
		password = password.split("\r\n")[0].split("\n")[0];

		return password;
	}

	async settingsGet(): Promise<SettingsData> {
		// Note: JSON.parse(JSON.stringify(...)) is not efficient, but does the job (of deep cloning).
		const settingsData: SettingsData = JSON.parse(JSON.stringify(settingsDataDefault));

		let conn: mariadb.PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();

			let rows = await conn.query("SELECT * FROM `Settings_IPNetworks`");
			for (const row of rows) {
				settingsData.ipNetworks.push(row);
			}

			rows = await conn.query("SELECT * FROM `Settings`");
			if (rows && rows[0]) {
				const settings = rows[0];
				settingsData.autoDetectNetworks = settings.autoDetectNetworks[0] === 1 ? true : false;
				settingsData.wolPort = settings.port;
			}
		} catch (err) {
			Log.error(err);
		} finally {
			if (conn) {
				conn.end();
			}
		}

		return settingsData;
	}

	async settingsPut(settingsData: SettingsData): Promise<boolean> {
		let conn: mariadb.PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();

			let res = await conn.query("DELETE FROM `Settings_IPNetworks`");
			if (res.warningStatus) {
				return false;
			}

			for (const ipNetwork of settingsData.ipNetworks) {
				res = await conn.query(
					"INSERT INTO `Settings_IPNetworks` (`ip`, `prefix`) VALUES (?, ?)",
					[ipNetwork.ip, ipNetwork.prefix]
				);
				if (!res || res.affectedRows !== 1) {
					return false;
				}
			}

			res = await conn.query("DELETE FROM `Settings`");
			if (res.warningStatus) {
				return false;
			}

			res = await conn.query(
				"INSERT INTO `Settings` (`autoDetectNetworks`, `port`) VALUES (?, ?)",
				[settingsData.autoDetectNetworks, settingsData.wolPort]
			);
			if (!res || res.affectedRows < 1) {
				return false;
			}
		} catch (err) {
			Log.error(err);
			return false;
		} finally {
			if (conn) {
				conn.end();
			}
		}
		return true;
	}

	async savedHostsGet(): Promise<Host[]> {
		const savedHosts: Host[] = [];

		let conn: mariadb.PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();

			let rows = await conn.query("SELECT * FROM `SavedHosts` ORDER BY `hostname`");
			for (const row of rows) {
				savedHosts.push({
					mac: row.mac,
					name: row.hostname
				});
			}
		} catch (err) {
			Log.error(err);
		} finally {
			if (conn) {
				conn.end();
			}
		}

		return savedHosts;
	}

	async savedHostsAdd(host: Host): Promise<boolean> {
		let conn: mariadb.PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();

			let res = await conn.query(
				"INSERT INTO `SavedHosts` (`mac`, `hostname`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `hostname` = ?",
				[host.mac, host.name, host.name]
			);
			if (!res || res.affectedRows < 1) {
				return false;
			}
		} catch (err) {
			Log.error(err);
			return false;
		} finally {
			if (conn) {
				conn.end();
			}
		}
		return true;
	}

	async savedHostsDelete(mac: string): Promise<boolean> {
		let conn: mariadb.PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();

			let res = await conn.query("DELETE FROM `SavedHosts` WHERE `mac` = ?", [mac]);
			if (!res || res.affectedRows < 1) {
				return false;
			}
		} catch (err) {
			Log.error(err);
			return false;
		} finally {
			if (conn) {
				conn.end();
			}
		}
		return true;
	}

	async organizationMappingIABGet(mac: string): Promise<string | null> {
		mac = mac.replace(/:/g, "-");
		const mac_part1 = mac.substr(0, 8);
		const mac_part2 = mac.substr(9, 8);

		let conn: mariadb.PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();

			let rows = await conn.query("SELECT `organization` " +
				"FROM `OrganizationMapping_IAB` " +
				"WHERE `mac_part1` = ? AND " +
				"? >= `mac_part2_range_start` AND " +
				"? <= `mac_part2_range_end`", [
					mac_part1, mac_part2, mac_part2
				]);
			if (!rows || rows.length === 0) {
				return null;
			}
			return rows[0]["organization"];
		} catch (err) {
			Log.error(err);
			return null;
		} finally {
			if (conn) {
				conn.end();
			}
		}
	}

	async organizationMappingOUIGet(mac: string): Promise<string | null> {
		mac = mac.replace(/:/g, "-");
		const mac_part1 = mac.substr(0, 8);

		let conn: mariadb.PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();

			let rows = await conn.query("SELECT `organization` " +
				"FROM `OrganizationMapping_OUI` " +
				"WHERE `mac_part1` = ?", [mac_part1]);
			if (!rows || rows.length === 0) {
				return null;
			}
			return rows[0]["organization"];
		} catch (err) {
			Log.error(err);
			return null;
		} finally {
			if (conn) {
				conn.end();
			}
		}
	}

	async organizationMappingInitialized(): Promise<boolean> {
		let conn: mariadb.PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();

			let rows = await conn.query("SELECT COUNT(*) AS `Count` FROM `OrganizationMapping_IAB`");
			if (!rows || !rows[0] || !rows[0]["Count"] || rows[0]["Count"] === 0) {
				return false;
			}
			
			rows = await conn.query("SELECT COUNT(*) AS `Count` FROM `OrganizationMapping_OUI`");
			if (!rows || !rows[0] || !rows[0]["Count"] || rows[0]["Count"] === 0) {
				return false;
			}
		} catch (err) {
			Log.error(err);
			return false;
		} finally {
			if (conn) {
				conn.end();
			}
		}
		return true;
	}

	async organizationMappingIABUpdate(items: IABEntry[]): Promise<boolean> {
		let conn: mariadb.PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();

			let res = await conn.query("DELETE FROM `OrganizationMapping_IAB`");
			if (res.warningStatus) {
				return false;
			}

			for (const item of items) {
				res = await conn.query(
					"INSERT INTO `OrganizationMapping_IAB` " +
					"(`mac_part1`, `mac_part2_range_start`, `mac_part2_range_end`, `organization`)" +
					"VALUES (?, ?, ?, ?);",
					[item.mac_part1, item.mac_part2_range_start, item.mac_part2_range_end, item.organization]
				);
				if (!res || res.affectedRows < 1) {
					return false;
				}
			}
		} catch (err) {
			Log.error(err);
			return false;
		} finally {
			if (conn) {
				conn.end();
			}
		}
		return true;
	}

	async organizationMappingOUIUpdate(items: OUIEntry[]): Promise<boolean> {
		let conn: mariadb.PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();

			let res = await conn.query("DELETE FROM `OrganizationMapping_OUI`");
			if (res.warningStatus) {
				return false;
			}

			for (const item of items) {
				res = await conn.query(
					"INSERT INTO `OrganizationMapping_OUI` " +
					"(`mac_part1`, `organization`)" +
					"VALUES (?, ?);",
					[item.mac_part1, item.organization]
				);
				if (!res || res.affectedRows < 1) {
					return false;
				}
			}
		} catch (err) {
			Log.error(err);
			return false;
		} finally {
			if (conn) {
				conn.end();
			}
		}
		return true;
	}
}
