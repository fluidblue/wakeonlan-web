export interface HostNaming {
	getHostNameByIP(ip: string): Promise<string | null>;
}
