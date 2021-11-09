const RecipesDb = require("../../db/schema");

module.exports = {
	checkRecipeId,
	checkNewRecipeBody,
};

function checkRecipeId(req, res, next) {
	const { id } = req.params;
	// 1. mongoose executed the query -> first parameter
	// 2. pass the result to the callback function --> second parameter
	// note all the callbacks in mongoose is callback(err , result)
	RecipesDb.findOne({ _id: id }, (err, recipe) => {
		if (err) {
			// we have access to whatever we pass to the next() function
			next({
				message: `Recipe with ${id} is not existed`,
				stack: err.stack,
				status: 404,
			});
		} else {
			// when we dont pass anything to the next() function
			// it means, 'Like saying, hey what's up pipeline of `middleware(s)`, time is money
			// so once one middleware is done, your job is to jump to the next middleware.
			// and if you didn't do you job correctly, i'll vanish you myself :)
			req.recipe = recipe;
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
