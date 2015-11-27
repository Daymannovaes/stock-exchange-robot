"use strict";

var fs = require("fs"),
	readline = require("readline");

var buildUrlInput = function(query) {
	if(!query || !query.stock)
		return "";

	var mini = query.mini == undefined ? true : !!query.mini;
	var stock = query.stock.toLowerCase();

	var url = "app/client/candles/candles_ibov_" + stock;
	url += mini ? "_mini.txt" : ".txt";

	return url;
}
var buildUrlOutput = function(query, period) {
	if(!query || !query.stock)
		return "";

	var url = buildUrlInput(query);
	url = url.substr(0, url.indexOf(".txt")); //remove .txt at the end

	url += "_period" + period + ".txt";

	url = url.replace('/candles/', '/candles/ema/');
	return url;
}

var calcEmaByLines = function(period, lastLineObj) {
	var output = this; //passed with .call(fileOutputStream, [...]);
	period = parseInt(period);

	var lineCount = 0,
		partial = 0,
		newLine,
		denominator = (period*period + period) / 2;

	return function (line) {
		lineCount++;

		if(lineCount == 1) {
			fs.write(output, "[\n");
			return;
		}

		var value = line.substr(line.indexOf(",") + 1);
		partial += parseFloat(value) * (((lineCount-1)%period)+1);

		lastLineObj.line = line + "|" + partial/(((lineCount%period)*((lineCount%period)+1))/2);
		if(lineCount%period == 0) {
			var dateTime = line.substr(0, line.indexOf(","));
			dateTime = (new Date(dateTime)).getTime();

			newLine = "[" + dateTime + "," + partial/denominator + "],\n";

			fs.writeSync(output, newLine);
			partial = 0;
			lastLineObj.line = 0;
		}

	};
}

var Controller = {};

Controller.index = function(req, res) {
	if(!req.query || !req.query.stock) {
		res.status(400).send("You need to provide the stock (like &stock=itub4)");
			return;
	}

	var period = req.query.period || 20,

		inputFile = buildUrlInput(req.query),
		outputFile = buildUrlOutput(req.query, period),

		fileInputStream = fs.createReadStream(inputFile),
		fileOutputStream = fs.openSync(outputFile, 'w');


	console.log("trying to read file \"%s\" with %d periods", inputFile, period);

	fileInputStream.on("error", function(error) {
		console.error("error on read \"%s\": \n\t%s", inputFile, error);

		res.status(400).send("Something wrong occurs (probably the file doesn't exists)" +
				"<br><span style='margin-left: 40px'>" + error + "</span>");
	});

	var rl = readline.createInterface({
		input: fileInputStream,
		output: process.stdout,
    	terminal: false
	});

	var lastLineObj = {
		line: 0
	};
	rl.on("line", calcEmaByLines.call(fileOutputStream, period, lastLineObj))
	  .on("close", function() {
	  	  if(lastLineObj.line) {
	  	  	var dateTime = lastLineObj.line.substr(0, lastLineObj.line.indexOf("|"));
	  	  	dateTime = dateTime.substr(0, dateTime.indexOf(","));
			dateTime = (new Date(dateTime)).getTime();

			console.log("\n\n\t\tLAST PERIOD: %s", lastLineObj.line);

			var newLine = "[" + dateTime + "," + lastLineObj.line.substr(lastLineObj.line.indexOf("|")+1) + "],\n";
			fs.writeSync(fileOutputStream, newLine);
	  	  }
  		  fs.writeSync(fileOutputStream, "]");
		  console.log("\n\tend of file %s", inputFile);
		  console.log("\n\twrote to: %s", outputFile);
		  
		  res.status(200).send("Wrote to: <a href='" + 
		  		"/public/" + outputFile.substr("app/client/".length) +
		  		"'>" + outputFile + "</a>");
	  });
}

module.exports = Controller;