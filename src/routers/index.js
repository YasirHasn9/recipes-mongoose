const express = require("express");
const router = express.Router();
const db = require("../../db/schema");

router.get("/", async (req, res) => {
	try {
		const recipes = await db.find();
		res.send({
			recipes: recipes,
		});
	} catch (err) {
		res.send({ err: err });
	}
});

module.exports = router;
