"use strict";

var Controller = {};

Controller.index = function(req, res) {
	res.sendFile("index.html", {root: __dirname + "/../../client"});
};

Controller.sma = function(req, res) {
	var period = req.params.period || 20;

	var rl = require("readline").createInterface({
		input: require("fs").createReadStream("file.in")
	});

	rl.on("line", function (line) {
		console.log("Line from file:", line);
	});
}

module.exports = Controller;