require("dotenv").config();
const port = process.env.PORT;
const server = require("./src/index");

server.listen(port, () => {
	console.log(process.env.URI);
	console.log(`http://localhost:${port}`);
});
