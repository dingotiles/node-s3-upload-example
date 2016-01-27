var express = require('express');
var cfenv = require("cfenv")

var appEnv = cfenv.getAppEnv()
var app = express();

var s3creds = appEnv.getServiceCreds('node-s3-example-s3')

app.get('/', function (req, res) {
  res.send('Hello World!\n' + JSON.stringify(s3creds));
});

app.listen(appEnv.port, appEnv.bind, function() {
    console.log("server starting on " + appEnv.url)
});
