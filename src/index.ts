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
const port = 8000;

// Serve static files
app.use("/", express.static(path.join(__dirname, "httpdocs")));

// REST API
app.get("/api", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`wakeonlan-web listening at http://localhost:${port}`);
});
