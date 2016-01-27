var express = require('express');
var cfenv = require("cfenv")

var appEnv = cfenv.getAppEnv()
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(appEnv.port, appEnv.bind, function() {
    console.log("server starting on " + appEnv.url)
});
