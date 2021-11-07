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
