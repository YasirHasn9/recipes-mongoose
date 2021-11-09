const mongoose = require("mongoose");

const recipesSchema = mongoose.Schema({
	name: {
		type: String,
		require: true,
		trim: true,
		lowercase: true,
		minLength: 2,
	},
	ingredients: { type: [String], require: true, minLength: 1 },
	instructions: { type: [String], require: true, minLength: 1 },
});
module.exports = mongoose.model("Recipes", recipesSchema);
