export interface IPNetwork {
	ip: string,
	subnet: number
}

export interface HostDiscovery {
	discover(
		ipSubnet: IPNetwork,
		callbackProgress: (done: number, total: number) => void,
		callbackHostFound: (ipAddress: string, macAddress: Uint8Array) => void,
		callbackDone: (err: Error | null) => void
	): void;

	isAvailable(callback: (res: boolean) => void): void;
}
