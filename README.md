# recipes-mongoose

Build a restApi using mongoose and nodeJS

### `There are some recommendation when to comes to design a RESTApi`

1. Everything is a resource
2. Each resource is accessible via a unique url
3. Resources can have multiple representations
4. Communication happens over a stateless Http
5. Resources management via http methods

### `Api constrains`

1. Design architecture
2. Stateless architecture
3. Cashable
4. Layered system
5. Code on demand
6. Uniforms interfaces

### `Error handling`

There is 2 types of error

1. Operation Error
   which happen when the client asks for a wrong endpoint or something we dont have on our program

2. Programmer Error
   which happens when we coded poorly

The cool part about that express has a default error handler for `synchronous` and `asynchronous` code.

#### `Synchronous`

like

```js
throw new Error(
	"Write the message here that we want to pass to the Error handler"
);
```

#### `Asynchronous`

Asynchronous function that invoked by routers and middlewares, we must pass them to next()

```js
app.get("/" , async (req, res, next) => {
    try{
        do something here
    } catch(err){
        // we have an error, then call the next and pass the error
        next(err)
    }
})
```

Express would not catch the errors in async operation unless we call next()
Promises automatically catch both synchronous errors and rejected promises, then use next()
Make sure we add the default error handling at the end

HTTP Status cheatsheet [https://devhints.io/http-status]

#### Create seeds in mongoose

What is seeds ?
Sometimes, we want a dumpy data just to make sure that our database works fine. It easier to to seed data and also it gives a sense of pride
that created seeds successfully, it makes want to accomplish more.

simply, seeds is data that have the same look as our schema.

we architect our schema. It create a collection, this collection is a list of objects

in `schema.js`

```js
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
```

Each object is a recipe. Recipe contains name, ingredients, and instructions

`Recipe object`

```js
recipeObject = {
	name: "name of the recipe",
	ingredients: ["ingredient 1", "ingredient 2"],
	instructions: ["step 1", "step 2"],
};
```

It nice to split our code and make it modular, it makes easy to debug, and well
structured.

Now, let's create a new file called `dummyData.js`

```js
const RecipeDb = require("./schema")
module.exports = [
    new RecipeDb({
        name: "name",
        ingredients: ["ingredient 1", "ingredient 2"]
        instructions: ["step 1" , "step 2"]
    }),
    ...,
    ...
]
```

In our seeds, we are gonna call the model we created in the our `schema.js`, and call the dummy data we are created in the `dummyData.js`

```js
const mongoose = require("mongoose");
const seeds = require("./dummyData");
const uri = process.env.URI;

mongoose
	.connect(uri, { useNewUrlParser: true })
	.catch(err => {
		console.log(err.stack);
		process.exit(1);
	})
	.then(() => {
		console.log("connected to db in development environment");
	});

seeds.map(async (r, index) => {
	await r.save((err, res) => {
		if (index === seeds.length - 1) {
			console.log("DONE!");
			mongoose.disconnect();
		}
	});
});
```

now, you have seeds in your database

#### ---------------------------------

#### Validation

we can have our collection validated while designing our schema type.
It works in `pre('save')` mood, it means that it makes sure it is validated before saving in the server.
Validation is async recursive, when calling model#save, a sub-document of validation is executed. It Error occurs, the callback function in model#save will receive it.
