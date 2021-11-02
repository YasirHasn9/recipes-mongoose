const mongoose = require("mongoose");
const Recipes = require("./schema");
const uri = process.env.URI;

const recipes = [
	new Recipes({
		name: "scrambledEggs",
		ingredients: ["1 tsp oil", "2 eggs", "salt"],
		instructions: [
			"Beat eggs with salt",
			"Heat oil in pan",
			"Add eggs to pan when hot",
			"Gather eggs into curds, remove when cooked",
			"Salt to taste and enjoy",
		],
	}),
	new Recipes({
		name: "garlicPasta",
		ingredients: [
			"500mL water",
			"100g spaghetti",
			"25mL olive oil",
			"4 cloves garlic",
			"Salt",
		],
		instructions: [
			"Heat garlic in olive oil",
			"Boil water in pot",
			"Add pasta to boiling water",
			"Remove pasta from water and mix with garlic olive oil",
			"Salt to taste and enjoy",
		],
	}),
	new Recipes({
		name: "chai",
		ingredients: [
			"400mL water",
			"100mL milk",
			"5g chai masala",
			"2 tea bags or 20 g loose tea leaves",
		],
		instructions: [
			"Heat water until 80 C",
			"Add milk, heat until 80 C",
			"Add tea leaves/tea bags, chai masala; mix and steep for 3-4 minutes",
			"Remove mixture from heat; strain and enjoy",
		],
	}),
];
mongoose
	.connect(uri, { useNewUrlParser: true })
	.catch(err => {
		console.log(err.stack);
		process.exit(1);
	})
	.then(() => {
		console.log("connected to db in development environment");
	});
recipes.map(async (r, index) => {
	await r.save((err, res) => {
		if (index === recipes.length - 1) {
			console.log("DONE!");
			mongoose.disconnect();
		}
	});
});
