const express = require("express");
const router = express.Router();
const db = require("../../db/schema");

router.get("/", async (req, res) => {
	try {
		const result = await db.find();
		res.send(result);
	} catch (err) {
		console.log(err);
	}
});

router.get("/recipeNames", async (req, res) => {
	try {
		const result = await db.find();
		const recipeNames = await result.map(r => r.name);
		res.send({
			recipeNames: recipeNames,
		});
	} catch (err) {
		console.log(err);
	}
});
module.exports = router;
