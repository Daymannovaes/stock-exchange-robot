"use strict";

var Sma = require("./sma");
var Cross = require("./cross");

var Controller = {
	Sma: Sma,
	Cross: Cross
};

Controller.index = function(req, res) {
	res.sendFile("index.html", {root: __dirname + "/../../client"});
};

module.exports = Controller;