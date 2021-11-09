const mongoose = require("mongoose");
const seeds = require("./recipesData");
const uri = process.env.URI;

mongoose
	.connect(uri, { useNewUrlParser: true })
	.catch(err => {
		console.log(err.stack);
		process.exit(1);
	})
	.then(() => {
		console.log("connected to db in development environment");
	});

seeds.map(async (r, index) => {
	await r.save((err, res) => {
		if (index === seeds.length - 1) {
			console.log("DONE!");
			mongoose.disconnect();
		}
	});
});
