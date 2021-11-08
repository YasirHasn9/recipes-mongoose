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

/*
It is just an idea, what if i used the properties as a validators to other 
properties
const recipesSchema = mongoose.Schema({
	name: { type: String, require: true },
	ingredients: { type: [String], require: () => this.name.length > 0},
	instructions: { type: [String], require: () => this.name.length > 0 },
});
*/
