var express = require('express');
var cfenv = require("cfenv")
var aws = require('aws-sdk');

var appEnv = cfenv.getAppEnv()
var app = express();

var s3creds = appEnv.getServiceCreds('node-s3-example-s3')

var AWS_ACCESS_KEY = s3creds.access_key_id;
var AWS_SECRET_KEY = s3creds.secret_access_key;
var S3_BUCKET = s3creds.bucket

aws.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });
aws.config.update({region: '' , signatureVersion: 'v4' });

app.get('/', function (req, res) {
  var s3 = new aws.S3();
  var path = 'node/hello_world'

  var params = {
    Bucket: S3_BUCKET,
    Key: path,
    Body: 'Hello! This is the content of the file ' + path + ' in bucket: ' + S3_BUCKET
  };

  s3.putObject(params, function(err, data) {

    if (err)
      console.log(err)
    else
      console.log("Successfully uploaded data to " + path);

  });
  res.send('A File has been successfully uploaded');
})

app.listen(appEnv.port, appEnv.bind, function() {
  console.log("server starting on " + appEnv.url)
})
