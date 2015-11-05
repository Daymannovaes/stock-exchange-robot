"use strict";

var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

var cookieParser = require("cookie-parser");
app.use(cookieParser());

var route = require("./route");
route(app, express);

var server = require("./server");
server(app);