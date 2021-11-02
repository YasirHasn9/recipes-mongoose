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

router.get("/names", async (req, res) => {
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

router.get("/:name", async (req, res) => {
	const { name } = req.params;
	try {
		const recipes = await db.find();
		for (const rec of recipes) {
			if (rec.name === name) {
				const ingredients = rec["ingredients"];
				const len = ingredients.length;
				res.send({
					details: {
						ingredients,
						numSteps: len,
					},
				});
			}
		}
	} catch (err) {
		res.send("err", err);
	}
});
module.exports = router;
