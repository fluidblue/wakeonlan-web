#!/usr/bin/env node

/*!
 * ==================================================================
 * 
 * wakeonlan-web
 * 
 * Created by Max Geissler
 * License: See LICENSE.md in the root directory of this repository.
 * 
 * ==================================================================
 */
 
import express from "express";
import path from "path";
import net from "net";

import { WakeOnLan } from "./WakeOnLan/WakeOnLan";
import WolNativeNode from "./WakeOnLan/WolNativeNode";

import { HostDiscovery } from "./HostDiscovery/HostDiscovery";
import ARPScan from "./HostDiscovery/ARPScan"

import { IPFunctions, IPNetwork } from "./HostDiscovery/IPFunctions";
import { MACFunctions } from "./HostDiscovery/MACFunctions";

const app = express();
const port = process.env.PORT || 8000;

// TODO: Look at wrap function from
// http://expressjs.com/en/advanced/best-practice-performance.html#use-promises

// Parse application/json and application/x-www-form-urlencoded in POST requests.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/", express.static(path.join(__dirname, "httpdocs")));

// REST API
app.post("/api/device-name/host-name", async (req, res, next) => {
	const ip = req.body["ip"];
	res.send("Not yet implemented.");
	next();
});

app.post("/api/device-name/vendor-name", async (req, res, next) => {
	const mac = req.body["mac"];
	res.send("Not yet implemented.");
	next();
});

app.post("/api/host-discovery/arp-scan", async (req, res, next) => {
	// Prepare for streaming
	res.set("Content-Type", "text/plain; charset=utf-8");
	res.set("Transfer-Encoding", "chunked");

	try {
		const cidrIpNetwork = req.body["ip-network"];
		const ipNetwork: IPNetwork = IPFunctions.getIPNetworkFromString(cidrIpNetwork);

		try {
			const hostDiscovery: HostDiscovery = new ARPScan();
			await hostDiscovery.discover(ipNetwork, undefined, (ip, mac) => {
				// Host discovered
				const host = {
					ip: ip,
					mac: MACFunctions.getMacAddressFromByteArray(mac)
				};
				res.write(JSON.stringify(host) + "\n");
			});
		} catch (err) {
			console.log("Error:", err);
			throw new Error(err);
		}
	} catch (err) {
		const data = {
			result: false
		};
		res.write(JSON.stringify(data) + "\n");
	} finally {
		// Finish streaming
		res.end();
		next();
	}
});

app.post("/api/host-discovery/arp-cache-and-ping", async (req, res, next) => {
	const cidrIpNetwork = req.body["ip-network"];

	// Prepare for streaming
	res.set("Content-Type", "text/plain; charset=utf-8");
	res.set("Transfer-Encoding", "chunked");

	res.write("Not yet implemented.\n");

	// Finish streaming
	res.end();
	next();
});

app.post("/api/wakeonlan", async (req, res, next) => {
	const mac = req.body["mac"];
	const options = {
		port: req.body["port"] || WakeOnLan.DEFAULT_PORT,
		address: req.body["ip"] || WakeOnLan.IP_BROADCAST_ADDRESS
	}

	try {
		if (options.port < 1 || options.port > 65535 || !net.isIP(options.address)) {
			throw new Error("Invalid input");
		}

		try {
			const wolManager: WakeOnLan = new WolNativeNode();
			await wolManager.wake(MACFunctions.getByteArrayFromMacAddress(mac), options);
			res.send(JSON.stringify({
				result: true
			}));
		} catch (err) {
			console.log("Error:", err);
			throw new Error(err);
		}
	} catch (err) {
		res.send(JSON.stringify({
			result: false
		}));
	} finally {
		next();
	}
});

app.listen(port, () => {
	console.log(`wakeonlan-web listening at http://localhost:${port}`);
});
