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
Controller.results = function(req, res) {
	res.sendFile("results.html", {root: __dirname + "/../../client"});
};
Controller.data = function(req, res) {
	res.sendFile("data.html", {root: __dirname + "/../../client"});
};
Controller.presentation = function(req, res) {
	res.sendFile("index.html", {root: __dirname + "/../../client/presentation"});
};

module.exports = Controller;