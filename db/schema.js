const mongoose = require("mongoose");

const recipesSchema = mongoose.Schema({
	name: String,
	ingredients: [String],
	instructions: [String],
});

module.exports = mongoose.model("Recipes", recipesSchema);
