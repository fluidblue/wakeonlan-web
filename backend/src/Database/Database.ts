import mariadb from "mariadb";
import fs from "fs";

import { IPNetwork, Host } from "wakeonlan-utilities";

export interface SettingsData {
	autoDetectNetworks: boolean;
	ipNetworks: IPNetwork[];
	wolPort: number;
}

const settingsDataDefault: SettingsData = {
	autoDetectNetworks: true,
	ipNetworks: [],
	wolPort: 9
};

export default class Database {
	private pool: mariadb.Pool;

	constructor() {
		this.pool = mariadb.createPool({
			host: process.env.DATABASE_HOST,
			user: process.env.DATABASE_USER,
			password: fs.readFileSync(process.env.DATABASE_PASSWORD_FILE!, "utf8"),
			database: process.env.DATABASE_DB,
			connectionLimit: 5
		});
	}

	async settingsGet(): Promise<SettingsData> {
		const settingsData: SettingsData = { ...settingsDataDefault };

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
			console.error("Error:", err); // TODO: Use a logger here
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

			res = await conn.query(
				"INSERT INTO `Settings` (`autoDetectNetworks`, `port`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `autoDetectNetworks` = ?, `port` = ?",
				[settingsData.autoDetectNetworks, settingsData.wolPort, settingsData.autoDetectNetworks, settingsData.wolPort]
			);
			if (!res || res.affectedRows < 1) {
				return false;
			}
		} catch (err) {
			console.error("Error:", err); // TODO: Use a logger here
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
			console.error("Error:", err); // TODO: Use a logger here
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
			console.error("Error:", err); // TODO: Use a logger here
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
			console.error("Error:", err); // TODO: Use a logger here
			return false;
		} finally {
			if (conn) {
				conn.end();
			}
		}
		return true;
	}
}
