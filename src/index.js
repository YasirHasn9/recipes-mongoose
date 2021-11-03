const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const recipesRouter = require("./routers/index");

const server = express();

// by default express, cant read request.body
// it cant parse these requests, this is why it needs
// to be told how to parse them
server.use(express.json()); // this invocation teaches the express how
// to get the req.body as json

// parse the request resource
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// secure and restrict the web server from accessing by websites and domains
server.use(cors());

const uri = process.env.URI;
mongoose.connect(uri);

server.use("/recipes", recipesRouter);

module.exports = server;
