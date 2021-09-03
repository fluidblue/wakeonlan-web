import { HostNaming } from "./HostNaming";
import os from "os";
import net from "net";
import { exec } from "child_process";

export class NetBiosNaming implements HostNaming {
	private static readonly RE_NET_BIOS_RESULT_MAC_OS: RegExp = /^(\S*)\s*0x([0-9A-Fa-f]{1,2})\s*(UNIQUE|GROUP).*$/gm;
	private static readonly RE_NET_BIOS_RESULT_LINUX: RegExp = /^\s*(\S*)\s*<([0-9A-Fa-f]{2})>.*?(GROUP|     ).*$/gm;

	private parseGeneric(rawOutput: string, re: RegExp): string | null {
		let result: string | null = null;
		let rawEntry;
		while ((rawEntry = re.exec(rawOutput)) !== null) {
			const netBiosName = rawEntry[1];
			const netBiosSuffix = rawEntry[2];
			const netBiosNameType = rawEntry[3];

			// For specs, see: https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-brws/0c773bdd-78e2-4d8b-8b3d-b7506849847b
			if (netBiosNameType !== "GROUP") {
				if (netBiosSuffix === "00") {
					result = netBiosName;
				} else if (netBiosSuffix === "20") {
					if (!result) {
						result = netBiosName;
					}
				}
			}
		}
		return result;
	}

	parseOnLinux(rawOutput: string): string | null {
		return this.parseGeneric(rawOutput, NetBiosNaming.RE_NET_BIOS_RESULT_LINUX);
	}

	parseOnMac(rawOutput: string): string | null {
		return this.parseGeneric(rawOutput, NetBiosNaming.RE_NET_BIOS_RESULT_MAC_OS);
	}

	async getHostNameByIP(ip: string): Promise<string | null> {
		// Check for valid input, as input is used in string literal
		if (!net.isIP(ip)) {
			throw new Error("Invalid input.");
		}

		let cmd: string = "";
		let parser: (rawOutput: string) => string | null = this.parseOnLinux;
		switch (os.platform()) {
			case "darwin":
				cmd = `smbutil status -ae ${ip}`;
				parser = this.parseOnMac;
				break;

			// On Windows, the output of command nbtstat is translated
			// to the system's language and therefore hard to parse.
			// It has not been investigated further.
			/*case "win32":
				cmd = `nbtstat -A ${ip}`;
				break;*/

			case "linux":
				cmd = `nmblookup -A ${ip}`;
				parser = this.parseOnLinux;
				break;

			default:
				throw new Error("OS not supported.");
		}

		// Bind "this" to class instance
		parser = parser.bind(this);

		const promise = new Promise<string | null>((resolve, reject) => {
			exec(cmd, (error, stdout, stderr) => {
				if (error) {
					reject(error);
					return;
				}
				if (stderr && stderr.length && stderr.length > 0) {
					reject(new Error(stderr));
					return
				}
				const result = parser(stdout);
				resolve(result);
			});
		});
		return await promise;
	}
}
