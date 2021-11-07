const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const helmet = require("helmet");
// const bodyParser = require("body-parser");
// const recipesRouter = require("./routers/index");

const recipesRouters = require("./recipesRouters/recipes");
const server = express();

// by default express, cant read request.body
// it cant parse these requests, this is why it needs
// to be told how to parse them and it adds on the express request
server.use(express.json()); // this invocation teaches the express how
// to get the req.body as json

// help to secure http requests by adding various headers
// server.use(helmet());

//

// the routers do not interact with database directly, instead we are gonna
// use a middleware between them which the functions that are provided by
// mongoose

server.use("/recipes", recipesRouters);

module.exports = server;
