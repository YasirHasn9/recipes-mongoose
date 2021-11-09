const mongoose = require("mongoose");
const recipesSchema = mongoose.Schema({
	name: {
		type: String,
		require: true,
		trim: true,
		lowercase: true,
		minLength: 2,
	},
	ingredients: { type: [String], require: true, minItems: 1 },
	instructions: { type: [String], require: true, minItems: 1 },
});

recipesSchema.path("ingredients").validate(value => {
	if (value.length < 1) {
		throw new Error("ingredients");
	}
});
recipesSchema.path("instructions").validate(value => {
	if (value.length < 1) {
		throw new Error("instructions");
	}
});
module.exports = mongoose.model("Recipes", recipesSchema);
