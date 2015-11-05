"use strict";

var Server = function(app) {	
	var server = app.listen(3000, function () {

		var host = server.address().address;
		var port = server.address().port;

		console.log("Stock exchange robot listening at http://%s:%s", host, port);

	});

	return server;
};

module.exports = Server;