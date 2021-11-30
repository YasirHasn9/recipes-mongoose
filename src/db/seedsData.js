const path = require("path");
require("dotenv").config({
	path: path.resolve("../../.env"),
});
const mongoose = require("mongoose");
const User = require("./usersSchema");
const uri = process.env.URI;

const seeds = [
	new User({
		username: "Yasir",
		password: "Hassan123",
	}),
	new User({
		username: "Ahmed",
		password: "Jeep123",
	}),
	new User({
		username: "Ali",
		password: "Jeep123",
	}),
];

mongoose
	.connect(uri, { useNewUrlParser: true })
	.catch(err => {
		console.log(err.stack);
		process.exit(1);
	})
	.then(() => {
		console.log("connected to db in development environment");
	});

seeds.map(async (u, index) => {
	await u.save((err, res) => {
		if (index === seeds.length - 1) {
			console.log("DONE!");
			mongoose.disconnect();
		}
	});
});
