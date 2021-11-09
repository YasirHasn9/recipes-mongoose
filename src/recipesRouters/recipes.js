const express = require("express");
const router = express.Router();
const RecipesDb = require("../../db/schema");
const { checkRecipeId, checkNewRecipeBody } = require("./middlewares");
router.get("/", async (req, res, next) => {
	try {
		const recipes = await RecipesDb.find();
		if (recipes.length > 0) {
			res.status(200).json(recipes);
		} else {
			res.status(200).json({
				message: `You need to create Recipes`,
			});
			next({});
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
		const recipes = await RecipesDb.find();
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

router.get("/:id", checkRecipeId, (req, res, next) => {
	try {
		const recipe = req.recipe;
		res.status(200).send(recipe);
	} catch (err) {
		next(err);
	}
});

router.post("/", checkNewRecipeBody, async (req, res, next) => {
	const newRecipe = new RecipesDb({
		name: req.body.name,
		ingredients: req.body.ingredients,
		instructions: req.body.instructions,
	});
	try {
		const recipes = await RecipesDb.find();
		const isNewCreatedRecipeExisted = await recipes.findIndex(
			r => r.name === newRecipe.name
		);
		if (isNewCreatedRecipeExisted > -1) {
			res.status(406).json({
				message: "Recipe is existed",
			});
		} else {
			await newRecipe.save((err, recipe) => {
				if (!recipe) {
					return next({
						status: 406,
						message: "Fields must be validated",
					});
				} else {
					res.status(201).json({
						message: "New Recipe is created",
					});
				}
			});
		}
	} catch (err) {
		next(err);
	}
});

router.put(
	"/:id",
	checkRecipeId,
	checkNewRecipeBody,
	async (req, res, next) => {
		// first find the recipe by its id
		// edit
		// send it back to the db
		try {
			const recipe = req.recipe;
			recipe.name = req.body.name;
			recipe.ingredients = req.body.ingredients;
			recipe.instructions = req.body.instructions;
			await recipe.save((err, recipe) => {
				if (!err) {
					res.status(201).json({
						message: "Recipe is updated",
					});
				}
			});
		} catch (err) {
			next(err);
		}
	}
);

router.delete("/:id", checkRecipeId, async (req, res, next) => {
	try {
		const recipe = req.recipe;
		const { id } = recipe;
		console.log(`This a deleted recipe`, id);
		await RecipesDb.deleteOne({ _id: id });
		res.status(202).json({
			message: "Recipe is deleted",
		});
	} catch (err) {
		next(err);
	}
});

router.use((err, req, res, next) => {
	res.status(err.status || 500).send({
		customDevMessage: "There is something wrong with the recipes router",
		message: err.message,
		stack: err.stack,
	});
});
module.exports = router;
