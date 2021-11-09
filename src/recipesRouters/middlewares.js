const mongoose = require("mongoose");
const RecipesDb = require("../../db/schema");
const { body, validationResult } = require("express-validation");

// const bodyValidation = {
// 	body: Joi.object({
// 		name: Joi.string().required(),
// 		ingredients:
// 	})
// };

module.exports = {
	checkRecipeId,
	checkNewRecipeBody,
};

function checkRecipeId(req, res, next) {
	const { id } = req.params;
	console.log("did it find ?", mongoose.isValidObjectId(id + "ee"));
	// 1. mongoose executed the query -> first parameter
	// 2. pass the result to the callback function --> second parameter
	// note /* all the callbacks in mongoose is callback(err , result)
	RecipesDb.findById({ _id: id }, (err, recipe) => {
		if (err) {
			// we have access to whatever we pass to the next() function
			next({
				status: 422,
				message: `Recipe with ${id} is not found`,
				stack: err.stack,
			});
		} else {
			req.recipe = recipe;
			// when we dont pass anything to the next() function
			// it means, 'Like saying, hey what's up pipeline of `middleware(s)`, time is money
			// so once one middleware is done, your job is to jump to the next middleware.
			// and if you didn't do you job correctly, i'll vanish you myself :)
			next();
		}
	});
}

async function checkNewRecipeBody(req, res, next) {
	const { name, ingredients, instructions } = req.body;
	if (!name || !ingredients || !instructions) {
		next({
			status: 406,
			message: "All Fields are required",
		});
	}
	next();
}
