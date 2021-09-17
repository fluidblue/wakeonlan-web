import mariadb from "mariadb";
import fs from "fs";

import { IPNetwork } from "wakeonlan-utilities";

// TODO: Replace with interface Host from frontend
export interface Host {
	mac: string;
	name: string;
}

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

			let res = await conn.query("INSERT INTO `SavedHosts` (`mac`, `hostname`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `hostname` = ?", [host.mac, host.name, host.name]);
			return res && res.affectedRows >= 1;
		} catch (err) {
			console.error("Error:", err); // TODO: Use a logger here
		} finally {
			if (conn) {
				conn.end();
			}
		}
		return false;
	}

	async savedHostsDelete(mac: string): Promise<boolean> {
		let conn: mariadb.PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();

			let res = await conn.query("DELETE FROM `SavedHosts` WHERE `mac` = ?", [mac]);
			return res && res.affectedRows >= 1;
		} catch (err) {
			console.error("Error:", err); // TODO: Use a logger here
		} finally {
			if (conn) {
				conn.end();
			}
		}
		return false;
	}
}
