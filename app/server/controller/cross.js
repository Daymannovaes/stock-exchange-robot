"use strict";

var async = require("async");
var fs = require("fs");

var stock = "itub4";
var getFileUrl = function(period, _stock) {

	var stock = _stock.toLowerCase() || stock;

	var url = "app/client/candles/candles_ibov_" +
			stock +
			"_mini_period" +
			period +
			".txt";

	return url;
}
var findStockByTime = function(stock, time) {
	for(var i=0; i<stock.length; i++) {
		if(stock[i][0] == time)
			return stock[i][1];
	}
	return null;
}


var Controller = {};
Controller.index = function(req, res) {
	if(!req.query || !req.query.periods) {
		res.status(400).send("You need to provide the periods (like &periods=20,30,500)");
			return;
	}

	var periods = req.query.periods.split(",");
	periods.sort(function(a,b){
		return parseInt(a)-parseInt(b)
	});
	var files = [];
	for(var i = 0; i<periods.length; i++) {
		files.push(getFileUrl(periods[i], stock));

		console.log("\n\t file: %s", getFileUrl(periods[i], stock));
	}

	//necessarily, the first results is more volatily than lasts,
	//because the "periods" are sorted before
	async.map(files, fs.readFile, function(err, results) {
	    for(var i=0; i<results.length; i++) {
	    	var result = results[i].toString();

	    	result = result.substr(0, result.lastIndexOf(",")) + "]";
	    	result = JSON.parse(result);

	    	results[i] = result;
	    }

	    var lastGreater = results[0][1] > results[1][1];
	    for(i=0; i<results[0].length; i++) {
	    	var previous = getPrevious(results[1], results[0][0]);
	    	var next = getNext(results[1], results[0][0]);
	    	
	    }

	    res.status(200).send("??");
	});
};

module.exports = Controller;