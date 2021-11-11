const mongoose = require("mongoose");
const recipesSchema = mongoose.Schema({
	name: {
		type: String,
		require: true,
		trim: true,
		lowercase: true,
		minLength: 2,
	},
	ingredients: {
		type: [String],
		// mongoose provides several ways to validate collections
		// this is the first way is a built in validators
		//where we embedded the validation inside the defined fields
		validate: {
			validator: function (val) {
				return val.length > 0;
			},
			message: `Length is not valid`,
		},
		require: [true, "At least one ingredients is required"],
	},
	instructions: {
		type: [String],
		validate: {
			validator: function (val) {
				return val.length > 0;
			},
			message: "You must put at least one Step",
		},
		require: [true, "At least one step is required"],
	},
});

// this is the second way
// where we embedded the validation inside the defined fields
// recipesSchema.path("ingredients").validate(value => {
// 	if (value.length < 1) {
// 		throw new Error("ingredients");
// 	}
// });
// recipesSchema.path("instructions").validate(value => {
// 	if (value.length < 1) {
// 		throw new Error("instructions");
// 	}
// });
module.exports = mongoose.model("Recipes", recipesSchema);
