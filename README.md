# Example nodejs application
This application consumes s3 credentials supplied via the [s3-cf-service-broker](https://github.com/cloudfoundry-community/s3-cf-service-broker).

## Run the app
```
cf create-service aws-s3-cf-service-broker basic node-s3-example-s3
cf push --no-start
cf bind-service node-s3-example node-s3-example-s3
cf start node-s3-example
```

## Accessing credentials
Use [cf-env](https://github.com/cloudfoundry-community/node-cfenv) to access the credentials via the method `require('cfenv').getAppEnv().getServiceCreds(/s3/)`. The method `getServiceCreds(spec)` must receive either the exact name or a regular expression matching the name of the service instance.

The returned structure looks like this:
```JSON
{
  "username": "IAM_USER_NAME"
  "access_key_id": "AWS_ACCESS_KEY",
  "secret_access_key": "AWS_SECRET",
  "bucket": "BUCKET_NAME"
}
```
