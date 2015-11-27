"use strict";

var sma = require("./sma");
var ema = require("./ema");
var Cross = require("./cross");

var Controller = {
	sma: sma,
	ema: ema,
	Cross: Cross
};

Controller.index = function(req, res) {
	res.sendFile("index.html", {root: __dirname + "/../../client"});
};

module.exports = Controller;