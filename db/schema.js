const mongoose = require("mongoose");

const recipesSchema = mongoose.Schema({
	name: { type: String, require: true },
	ingredients: { type: [String], require: true },
	instructions: { type: [String], require: true },
});
module.exports = mongoose.model("Recipes", recipesSchema);
