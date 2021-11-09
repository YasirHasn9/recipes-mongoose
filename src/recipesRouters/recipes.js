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
		const isCreated = await RecipesDb.find();
		console.log("check it there", isCreated);
		const isCreatedThere = isCreated.findIndex(r => r.name === newRecipe.name);
		console.log(
			`check if the recipe is already existed in the database`,
			isCreatedThere
		);

		if (isCreatedThere > -1) {
			res.status(406).json({
				message: "Recipe is existed",
			});
		} else {
			res.status(200).json({ msg: "work" });
		}
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
