"use strict";

var Sma = require("./sma");

var Controller = {
	Sma: Sma
};

Controller.index = function(req, res) {
	res.sendFile("index.html", {root: __dirname + "/../../client"});
};

module.exports = Controller;