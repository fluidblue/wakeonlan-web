declare module 'network' {
    export function get_gateway_ip(callback: (err: any, ip: string) => void);
}
