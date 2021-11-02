const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const recipesRouter = require("./routers/index");

const server = express();

// parse the request resource
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// secure and restrict the web server from accessing by websites and domains
server.use(cors());

const uri = process.env.URI;
mongoose.connect(uri);

server.use("/recipes", recipesRouter);

module.exports = server;
