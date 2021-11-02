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
module.exports = router;
