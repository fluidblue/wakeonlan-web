import os from "os";
import net from "net";
import { exec } from "child_process";

export class Ping {
	private static readonly PING_TIMEOUT: number = 1; // in seconds

	private constructor() {}

	static ping(ip: string, callback?: (error: Error | null) => void): void {
		// Check for valid input, as input is used in string literal
		if (!net.isIP(ip)) {
			if (callback) {
				callback(new Error("Invalid input."));
			}
			return;
		}

		let cmd: string = "";
		switch (os.platform()) {
			case "darwin":
				cmd = `ping -c 1 -n -q -t ${this.PING_TIMEOUT} ${ip}`;
				break;

			case "win32":
				const timeout = this.PING_TIMEOUT * 1000;
				cmd = "ping -n 1 -w ${timeout} ${ip}";
				break;

			case "android":
				cmd = "/system/bin/ping -q -n -w ${this.PING_TIMEOUT} -c 1 ${ip}";
				break;

			case "linux":
				cmd = "ping -c 1 -n -q -w ${this.PING_TIMEOUT} ${ip}";
				break;

			default:
				if (callback) {
					callback(new Error("OS not supported."));
				}
				return;
		}

		exec(cmd, (error, stdout, stderr) => {
			if (callback) {
				if (error && error.code && (error.code === 1 || error.code === 2)) {
					// Ignore exit codes of 1 and 2. Those signal that the host is down.
					// (The exit codes vary among operating systems).
					error = null;
				}
				if (error) {
					callback(error);
					return;
				}
				if (stderr && stderr.length > 0) {
					callback(new Error(stderr));
					return;
				}
				callback(null);
			}
		});
	}
}
