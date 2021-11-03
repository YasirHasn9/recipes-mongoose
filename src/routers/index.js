const express = require("express");
const router = express.Router();
const db = require("../../db/schema");

// the routers do not interact with database directly, instead we are gonna
// use a middleware between them which the function that are provided by
// mongoose

router.get("/", async (req, res) => {
	try {
		const result = await db.find();
		res.send(result);
	} catch (err) {
		res.status(500).json(err.message);
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
		res.status(500).json(err.message);
	}
});

router.get("/details/:name", async (req, res) => {
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
		res.status(500).json(err.message);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const recipe = await db.findOne({
			_id: req.params.id,
		});
		res.send({
			recipe,
		});
	} catch (err) {
		res.status(404).json(err.message);
	}
});

router.post("/", async (req, res) => {
	// check if the client input all the required fields
	try {
		if (!req.body.name || req.body.ingredients || req.body.instructions) {
			res.status(400).json({
				message: "All the fields must be required",
			});
		} else {
			// create a new recipe
			const recipe = new db({
				name: req.body.name,
				ingredients: req.body.ingredients,
				instructions: req.body.instructions,
			});
			// check if the db had it
			const existedRecipe = await db.findOne({ name: recipe.name });
			if (existedRecipe) {
				res.status(400).json({
					error: "Recipe already exists",
				});
			} else {
				// save the new recipe
				await recipe.save();
				res.status(201);
			}
		}
	} catch (err) {
		res.status(500).json("Err", err.message);
	}
});

router.put("/:id", async (req, res) => {
	// find a recipe by id
	try {
		const existedRecipe = await db.findOne({ _id: req.params.id });
		const { name, ingredients, instructions } = req.body;
		if (name) {
			existedRecipe.name = name;
		}
		if (ingredients) {
			existedRecipe.ingredients = ingredients;
		}
		if (instructions) {
			existedRecipe.instructions = instructions;
		}
		await existedRecipe.save();
		res.status(200).json(existedRecipe);
	} catch (err) {
		res.status(500).json(err.message);
	}
	// check if we have in the db
	// edit it
	// send it over to the db to save it.
});

router.delete("/:id", async (req, res) => {
	try {
		// find it
		// delete
		await db.deleteOne({ _id: req.params.id });
		res.status(200).json("recipe been deleted");
	} catch (err) {
		res.status(500).json(err.message);
	}
});
// to make the server request-able by other modules, we export it.
module.exports = router;
