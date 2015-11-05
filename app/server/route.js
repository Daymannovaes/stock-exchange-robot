"use strict";

var controller = require("./controller/index");

var Route = function(app, express) {	
	app.use("/public", express.static(__dirname + "/../client"));

	app.get("/", controller.index);

	/*
	app.get("/users", controller.User.getAll);
	app.post("/user", controller.User.add);
	app.get("/user/:hash/tags", controller.User.getTags);
	*/

	/* app.route("/book/:hash")
		.get(controller.book.get)
		.put(controller.book.put)
		.delete(controller.book.delete);
	*/
	
};

module.exports = Route;