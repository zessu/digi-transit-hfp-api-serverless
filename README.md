# MaaS backend-recruit-exercise-boilerplate

Use this as the starting point for the exercise. This boilerplate serves as guidance / starting point and should save you some time :)

## Excercise description

Create a Serverless service which fetches specified vehicle position from the [Digitransit's High-frequency positioning (HFP) API](https://digitransit.fi/en/developers/apis/4-realtime-api/vehicle-positions-2/)

## Prerequisite

Your own AWS account and credentials. Setup can be found in Serverless framework CLI doc

## Requirements

- NodeJS as the programming language
- [Serverless Framework](https://serverless.com/) as a deployment tool
- AWS as the cloud provider. Services allowed for this exercise: API Gateway REST (not socket), Lambda, CloudFormation, DynamoDB, StepFunctions, CloudWatch, SNS, SQS, Fargate.
- REST API must have:

  - A lambda that serves as background runner to poll vehicle position from Digitransit HFP API and save to DynamoDB. This should timeout in 5 minutes

  - A REST endpoint that starts the vehicle tracking (endpoint A). This endpoint should start another lambda (lambda 1) asynchronously. Endpoint must throw error if there exists another background process polling the same vehicle

  - A REST endpoint that can be used to fetch the position for specific bus/tram/metro/train line (endpoint B) from DynamoDB

## Bonus requirements

- Endpoint B must include polyline that plots out the movement of the vehicle in the last 2 minutes
- Estimate next stop arrival based on the movement of the vehicle

## Deliverable

Private git repository in Github, Gitlab or Bitbucket (share the repo with ["laardee"](https://github.com/laardee/) and ["hieuunguyeen"](https://github.com/hieuunguyeen/))
