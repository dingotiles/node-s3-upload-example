# Example nodejs application
This application consumes s3 credentials supplied via the [s3-cf-service-broker](https://github.com/cloudfoundry-community/s3-cf-service-broker).

## Run the app
```
cf create-service aws-s3-cf-service-broker basic node-s3-example-s3
cf push --no-start
cf bind-service node-s3-example node-s3-example-s3
cf start node-s3-example
```
