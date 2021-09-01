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

import { WakeOnLan } from "./WakeOnLan/WakeOnLan";
import WolNativeNode from "./WakeOnLan/WolNativeNode";

import { MACFunctions } from "./HostDiscovery/MACFunctions";

const app = express();
const port = process.env.PORT || 8000;

// Parse application/json and application/x-www-form-urlencoded in POST requests.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/", express.static(path.join(__dirname, "httpdocs")));

// REST API
app.post("/api/device-name/host-name", (req, res, next) => {
	const ip = req.body["ip"];
	res.send("Not yet implemented.");
	next();
});

app.post("/api/device-name/vendor-name", (req, res, next) => {
	const mac = req.body["mac"];
	res.send("Not yet implemented.");
	next();
});

app.post("/api/host-discovery/arp-scan", (req, res, next) => {
	const cidrIpNetwork = req.body["ip-network"];

	// Prepare for streaming
	res.set("Content-Type", "text/plain");
	res.set("Transfer-Encoding", "chunked");

	res.write("Not yet implemented.\n");

	// Finish streaming
	res.end();
	next();
});

app.post("/api/host-discovery/arp-cache-and-ping", (req, res, next) => {
	const cidrIpNetwork = req.body["ip-network"];

	// Prepare for streaming
	res.set("Content-Type", "text/plain");
	res.set("Transfer-Encoding", "chunked");

	res.write("Not yet implemented.\n");

	// Finish streaming
	res.end();
	next();
});

app.post("/api/wakeonlan", (req, res, next) => {
	const mac = req.body["mac"];
	const port = req.body["port"] || WakeOnLan.DEFAULT_PORT;
	const ip = req.body["ip"] || WakeOnLan.IP_BROADCAST_ADDRESS;

	const options = {
		port: port,
		address: ip
	}

	const wolManager: WakeOnLan = new WolNativeNode();
	wolManager.wake(MACFunctions.getByteArrayFromMacAddress(mac), options).catch((err) => {
		res.send(JSON.stringify({
			result: false
		}));
	}).then(() => {
		res.send(JSON.stringify({
			result: true
		}));
	}).finally(() => {
		next();
	});
});

app.listen(port, () => {
	console.log(`wakeonlan-web listening at http://localhost:${port}`);
});
