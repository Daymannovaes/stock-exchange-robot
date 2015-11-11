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
var getPN = function(serie, time) {
	for(var i=1; i<serie.length; i++) {
		if(serie[i][0] >= time) {
			return {
				previous: serie[i-1],
				next: serie[i]
			}
		}
	}
};
var relativePosition = function(p1, p2, p) {
	var x=0, y=1;
	var xDelta = p2[x] - p1[x];
	var yDelta = p2[y] - p1[y];

	var xDiff = p[x] - p1[x];
	var percentDiff = xDiff / xDelta;

	var relativeY = p1[y] + (yDelta * percentDiff);

	return [p[x], relativeY];
}
var relativePositionIsUp = function(p1, p2, p) {
	var y=1;
	var relativeP = relativePosition(p1, p2, p);

	return p1[y] >= relativeP[y];
}
var readAllFilesAndCross = function(files, periods, res) {
	readAllFiles(files, function(err, results) {
	    for(var i=0; i<results.length; i++) {
	    	var result = results[i].toString();

	    	result = result.substr(0, result.lastIndexOf(",")) + "]";
	    	result = JSON.parse(result);

	    	results[i] = result;
	    }

	    var serie1 = results[0];
	    var serie2 = results[1];

	    var lastIsUp,
	    	actualIsUp,
	    	relativeP;
	    for(i=0; i<results[0].length; i++) {
	    	var pn = getPN(serie2, serie1[i][0]);
	    	actualIsUp = !relativePositionIsUp(pn.previous, pn.next, serie1[i]);

	    	if(lastIsUp != undefined && lastIsUp && !actualIsUp){
	    		relativeP = relativePosition(pn.previous, pn.next, serie1[i]);
	    		console.log("\n\n\n\tCruzamento de descida entre %d e %d, em (%d,%d)",
	    			periods[0], periods[1],
	    			relativeP[0], parseInt(relativeP[1]*1000)/1000);
	    		console.log("\n\t   O ponto comparado foi (period%d) (%d,%d)",
	    			periods[0],
	    			serie1[i][0], parseInt(serie1[i][1]*1000)/1000);
	    	}
	    	if(lastIsUp != undefined && !lastIsUp && actualIsUp) {
	    		relativeP = relativePosition(pn.previous, pn.next, serie1[i]);
	    		console.log("\n\n\n\tCruzamento de subida entre %d e %d, em (%d,%d)",
	    			periods[0], periods[1],
	    			relativeP[0], parseInt(relativeP[1]*1000)/1000);
	    		console.log("\n\t   O ponto comparado foi (period%d) (%d,%d)",
	    			periods[0],
	    			serie1[i][0], parseInt(serie1[i][1]*1000)/1000);
	    	}

	    	lastIsUp = actualIsUp;
	    }

	    res.status(200).send("Done, check console");
	});
};
var readAllFiles = function(files, callback) {
	async.map(files, fs.readFile, callback);
};

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
	readAllFilesAndCross(files, periods, res);
};

module.exports = Controller;