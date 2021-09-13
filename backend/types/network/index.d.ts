declare module 'network' {
	export interface Interface {
		name: string;
		ip_address: string;
		mac_address: string;
		type: string;
		netmask: string;
		gateway_ip: string;
	};
	export function get_gateway_ip(callback: (err: any, ip: string) => void);
	export function get_interfaces_list(callback: (err: any, list?: Interface[]) => void);
}
