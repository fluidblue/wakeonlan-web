import mariadb from "mariadb";
import fs from "fs";

export default class Database {
	private pool: mariadb.Pool;

	constructor() {
		this.pool = mariadb.createPool({
			host: process.env.DATABASE_HOST,
			user: process.env.DATABASE_USER,
			password: fs.readFileSync(process.env.DATABASE_PASSWORD_FILE!, "utf8"),
			connectionLimit: 5
		});
	}
}
