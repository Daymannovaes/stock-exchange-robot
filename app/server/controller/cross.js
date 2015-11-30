"use strict";

var async = require("async");
var fs = require("fs");

var stock = "itub4";
var getFileUrl = function(period, _stock, type) {

	var stock = _stock.toLowerCase() || stock;

	var url = "app/client/candles/" + type + "/candles_ibov_" +
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
var readAllFilesAndCross = function(files, periods, callback) {
	readAllFiles(files, function(err, results) {
	    for(var i=0; i<results.length; i++) {
	    	var result = results[i].toString();

	    	result = result.substr(0, result.lastIndexOf(",")) + "]";
	    	result = JSON.parse(result);

	    	results[i] = result;
	    }

	    var serie1 = results[0];
	    var serie2 = results[1];

	    var up = 0,
	    	down = 0;

	    var lastIsUp,
	    	actualIsUp,
	    	relativeP;

	    var lastValue;
	    var losesCount = 0, gainsCount = 0;
	    var loses = 0;
	    var gains = 0;
	    for(i=0; i<results[0].length; i++) {
	    	var pn = getPN(serie2, serie1[i][0]);
	    	actualIsUp = !relativePositionIsUp(pn.previous, pn.next, serie1[i]);

	    	if(lastIsUp != undefined && lastIsUp && !actualIsUp){
	    		down++;
	    		
	    		relativeP = relativePosition(pn.previous, pn.next, serie1[i]);

	    		if(relativeP[1] - lastValue < 0) {
	    			console.log("\n\t\tPerda por ação: R$%d",  - relativeP[1] + lastValue);
	    			loses += - relativeP[1] + lastValue;
	    			losesCount++;
	    		}
	    		else if(!isNaN(lastValue)){
	    			console.log("\n\tGanho por ação: R$%d", relativeP[1] - lastValue);
	    			gains += relativeP[1] - lastValue;
	    			gainsCount++;
	    		}
	    	}
	    	if(lastIsUp != undefined && !lastIsUp && actualIsUp) {
	    		up++;
	    		
	    		relativeP = relativePosition(pn.previous, pn.next, serie1[i]);
	    		lastValue = relativeP[1];
	    	}

	    	lastIsUp = actualIsUp;
	    }

	    callback({
	    	status: 200,
	    	up: up,
	    	down: down,
	    	loses: loses,
	    	gains: gains,
	    	losesCount: losesCount,
	    	gainsCount: gainsCount
	   	});
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
	var type = req.query.type || "sma";
	periods.sort(function(a,b){
		return parseInt(a)-parseInt(b)
	});
	var files = [];
	for(var i = 0; i<periods.length; i++) {
		files.push(getFileUrl(periods[i], stock, type));

		console.log("\n\t file: %s", getFileUrl(periods[i], stock, type));
	}

	//necessarily, the first results is more volatily than lasts,
	//because the "periods" are sorted before
	readAllFilesAndCross(files, periods, function(params) {
		var text = "Done " + type + ", check console. Crossings: " + (params.up+params.down);

		text += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;up: " + params.up + ", down: " + params.down + ", cross: " + (params.up+params.down);
		text += "<br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Perda total: R$" + params.loses;
		text += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Erros: " + params.losesCount;
		text += "<br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ganho total: R$" + params.gains;
		text += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Acertos: " + params.gainsCount;
		text += "<br><br><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Resultado Final: R$: " + (params.gains-params.loses);

		console.log("\n\n\n\n\n\t\t\tup: %d, down: %d, cross: %d", params.up, params.down, params.up+params.down);
		console.log("\n\n\t\t\tPerda total: R$%d", params.loses);
		
		console.log("\n\t\t\t\tErros: %d", params.losesCount);
		console.log("\n\t\t\tGanho total: R$%d", params.gains);
		console.log("\n\t\t\t\tAcertos: %d", params.gainsCount);
		console.log("\n\t\t\tResultado final: R$%d", params.gains - params.loses);
		
		res.status(params.status || 200).send(text);
	});
};

module.exports = Controller;