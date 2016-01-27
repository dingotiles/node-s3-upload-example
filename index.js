var express = require('express');
var cfenv = require("cfenv")
var aws = require('aws-sdk');

var appEnv = cfenv.getAppEnv()
var app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);


/*
 * Configure AWS sdk
 */
var s3creds = appEnv.getServiceCreds('node-s3-example-s3')
aws.config.update({
  accessKeyId: s3creds.access_key_id,
  secretAccessKey: s3creds.secret_access_key,
  signatureVersion: 'v4'
});

var BUCKET_NAME = s3creds.bucket;

/*
 * Set CORS Configuration for Bucket
 * to allow access from this apps URLs
 */
(function() {
  var params = {
    Bucket: BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedMethods: [ 'GET', 'POST', 'PUT' ],
          AllowedOrigins: appEnv.urls,
          AllowedHeaders: [ '*' ]
        },
      ]
    }
  };
  var s3 = new aws.S3();
  s3.putBucketCors(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
})();

/*
 * Respond to GET requests to /.
 * Upon request, render the 'index.html' web page in views/ directory.
 */
app.get('/', function(req, res){
  res.render('index.html');
});

/*
 * Respond to GET requests to /sign_s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and the
 * anticipated URL of the image.
 */
app.get('/sign_s3', function(req, res){
  var s3 = new aws.S3();
  var s3_params = {
    Bucket: BUCKET_NAME,
    Key: req.query.file_name,
    Expires: 60,
    ContentType: req.query.file_type,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3_params, function(err, data){
    if(err){
      console.log(err);
    }
    else{
      var return_data = {
        signed_request: data,
        url: 'https://'+BUCKET_NAME+'.s3.amazonaws.com/'+req.query.file_name
      };
      res.write(JSON.stringify(return_data));
      res.end();
    }
  });
});

/*
 * Start the server to handle incoming requests.
 */
app.listen(appEnv.port, appEnv.bind, function() {
  console.log("server starting on " + appEnv.url)
})
