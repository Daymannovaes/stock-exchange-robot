"use strict";

var Controller = {};

Controller.index = function(req, res) {
	res.sendFile("index.html", {root: __dirname + "/../../client"});
};

module.exports = Controller;