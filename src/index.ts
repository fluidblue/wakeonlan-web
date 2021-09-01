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

const app = express();
const port = process.env.PORT || 8000;

// Parse application/json and application/x-www-form-urlencoded in POST requests.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/", express.static(path.join(__dirname, "httpdocs")));

// REST API
app.post("/api/device-name/host-name", (req, res) => {
	const ip = req.body["ip"];
	res.send("Not yet implemented.");
});

app.post("/api/device-name/vendor-name", (req, res) => {
	const mac = req.body["mac"];
	res.send("Not yet implemented.");
});

app.post("/api/host-discovery/arp-scan", (req, res) => {
	const cidrIpNetwork = req.body["ip-network"];

	// Prepare for streaming
	res.set("Content-Type", "text/plain");
	res.set("Transfer-Encoding", "chunked");

	res.write("Not yet implemented.\n");

	// Finish streaming
	res.end();
});

app.post("/api/host-discovery/arp-cache-and-ping", (req, res) => {
	const cidrIpNetwork = req.body["ip-network"];

	// Prepare for streaming
	res.set("Content-Type", "text/plain");
	res.set("Transfer-Encoding", "chunked");

	res.write("Not yet implemented.\n");

	// Finish streaming
	res.end();
});

app.post("/api/wakeonlan", (req, res) => {
	const mac = req.body["mac"];
	const port = req.body["port"];
	const ip = req.body["ip"];
	res.send("Not yet implemented.");
});

app.listen(port, () => {
	console.log(`wakeonlan-web listening at http://localhost:${port}`);
});
