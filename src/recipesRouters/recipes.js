const express = require("express");
const router = express.Router();
const recipesDb = require("../../db/schema");
const { checkRecipeId } = require("./middlewares");
router.get("/", async (req, res, next) => {
	try {
		const recipes = await recipesDb.find();
		if (recipes) {
			res.status(200).json(recipes);
		}
	} catch (err) {
		next(err);
	}
});

// we can get some information through travelling our url,
// Look, nodeJs allows to have access to the url and find something called query
// query is a key/value-like, it behaves "key=value" that they are
// coming after the "?" in url
router.get("/names", async (req, res, next) => {
	try {
		const recipes = await recipesDb.find();
		const recipeNames = recipes.map(r => r.name);
		res.send({
			recipeNames: recipeNames,
		});
	} catch (err) {
		next(err);
	}
});

// since I use the ':' after the '/', which that is gonna make it an 'id'
// we can the from the request under the ['params'] property

router.get("/:id", checkRecipeId, async (req, res, next) => {
	const recipe = req.recipe;
	res.send(recipe);
});

router.post("/", async (req, res, next) => {
	// check if the client input all the required fields
	try {
		if (!req.body.name || req.body.ingredients || req.body.instructions) {
			res.status(400).json({
				message: "All the fields must be required",
			});
		} else {
			// create a new recipe
			const recipe = new recipesDb({
				name: req.body.name,
				ingredients: req.body.ingredients,
				instructions: req.body.instructions,
			});
			// check if the db had it
			const existedRecipe = await recipesDb.findOne({ name: recipe.name });
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
		next(err);
	}
});

// router.put("/:id", async (req, res, next) => {
// 	// find a recipe by id
// 	try {
// 		const existedRecipe = await db.findOne({ _id: req.params.id });
// 		const { name, ingredients, instructions } = req.body;
// 		if (name) {
// 			existedRecipe.name = name;
// 		}
// 		if (ingredients) {
// 			existedRecipe.ingredients = ingredients;
// 		}
// 		if (instructions) {
// 			existedRecipe.instructions = instructions;
// 		}
// 		await existedRecipe.save();
// 		res.status(200).json(existedRecipe);
// 	} catch (err) {
// 		next(err);
// 	}
// });

// // the value after the "/" is always gonna be string even if we pass
// // a numeric value
// router.delete("/:id", async (req, res, next) => {
// 	try {
// 		// find it
// 		// delete
// 		await db.deleteOne({ _id: req.params.id });
// 		// to send to the client a successful no content, we use 204
// 		res.status(200).json("recipe been deleted");
// 	} catch (err) {
// 		next(err);
// 	}
// });

// error handling
// router.use((err, req, res, next) => {
// 	res.status(err.status || 500).json({
// 		msg: err.message,
// 		stack: err.stack,
// 	});
// });
router.use((err, req, res, next) => {
	res.status(err.status || 500).send({
		customDevMessage: "There is something wrong with the recipes router",
		message: err.message,
		stack: err.stack,
	});
});
module.exports = router;
