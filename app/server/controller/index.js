"use strict";

var Controller = {};

Controller.index = function(req, res) {
	res.sendFile("index.html", {root: __dirname + "/../../client"});
};

Controller.sma = function(req, res) {
	var period = req.params.period || 20;

	var rl = require("readline").createInterface({
		input: require("fs").createReadStream("app/client/candles_ibov_itub4_mini.txt")
	});

	rl.on("line", function (line) {
		console.log("Line from file: ", line);
	});
	console.log("period: ", period);

	req.next();
}

module.exports = Controller;