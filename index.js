require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const port = process.env.PORT;
const uri = process.env.URI;
const mongoose = require("mongoose");

//connect to the db
mongoose.connect(uri);

// get the server
const server = require("./src/index");
server.use(express.json());
// parse the request resource and put on the request object
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
// restrict the web from accessing different web servers and domains
server.use(cors());
server.use(helmet());

// server.use(function (req, res) {
// 	res.status(404);

// 	// respond with json
// 	if (req.accepts("json")) {
// 		res.json({ error: "Not found" });
// 		return;
// 	}

// 	// default to plain-text. send()
// 	res.type("txt").send("Not found");
// });

server.use("/hey", (req, res) => {
	res.status(200).json({
		message: "Welcome to the recipes api",
	});
});
server.listen(port, () => {
	console.log(`http://localhost:${port}`);
});
