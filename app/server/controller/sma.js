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
	return url;
}

var calcSmaByLines = function(period) {
	var output = this; //passed with .call(fileOutputStream, [...]);

	var lineCount = 0,
		partial = 0,
		newLine;

	return function (line) {
		lineCount++;

		if(lineCount == 1) {
			fs.write(output, "[\n");
			return;
		}

		var value = line.substr(line.indexOf(",") + 1);
		partial += parseFloat(value);

		if(lineCount%period == 0) {
			var dateTime = line.substr(0, line.indexOf(","));
			dateTime = (new Date(dateTime)).getTime();

			newLine = "[" + dateTime + "," + partial/period + "],\n";

			fs.write(output, newLine);
			partial = 0;
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

	rl.on("line", calcSmaByLines.call(fileOutputStream, period))
	  .on("close", function() {
  		  fs.write(fileOutputStream, "]");
		  console.log("\n\tend of file %s", inputFile);
		  console.log("\n\twrote to: %s", outputFile);
		  
		  res.status(200).send("Wrote to: <a href='" + 
		  		"/public/" + outputFile.substr("app/client/".length) +
		  		"'>" + outputFile + "</a>");
	  });
}

module.exports = Controller;