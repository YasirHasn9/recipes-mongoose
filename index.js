require("dotenv").config();
const port = process.env.PORT;
const server = require("./src/index");
server.use(function (req, res) {
	res.status(404);

	// respond with json
	if (req.accepts("json")) {
		res.json({ error: "Not found" });
		return;
	}

	// default to plain-text. send()
	res.type("txt").send("Not found");
});
server.listen(port, () => {
	console.log(`http://localhost:${port}`);
});
