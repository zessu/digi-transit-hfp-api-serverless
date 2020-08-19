import createError from 'http-errors';
import fetch from 'axios';
// import request from './vehicle-tracking-request/index';

import commonMiddleware from './commonMiddleware';

const getVehicleStatus = async () => ({
  statusCode: 200,
  body: 'some random string here',
});

const startPolling = async () => ({
  statusCode: 200,
  body: 'some random string here',
});

const requestTracker = async (event) => {
  const { id } = event.pathParameters;
  console.log(`supplied id is ${id}`);
  // const config = new AWS.Config({
  //   accessKeyId: process.env.awsAccessKeyId,
  //   secretAccessKey: process.env.awsSecretAccessKey,
  //   region: process.env.awsDefaultRegion,
  // });
  // AWS.config.update(config);
  // const ecs = new AWS.ECS();
  const gatewayResource = 'http://hslpollerLoadBalancer-1683342120.eu-west-1.elb.amazonaws.com';
  const requestUrl = `${gatewayResource}/request/${id}`;

  fetch(requestUrl)
    .then((response) => {
      console.log(`we got a successful response from the server ${JSON.stringify(response)}`);
      const payload = response;
      return {
        statusCode: 200,
        body: `${JSON.stringify(payload)}`,
      };
    })
    .catch((error) => new createError.BadRequest(`there was an error ${error}`)); // caught by the catch block

  // const params = {
  //   cluster: 'hslpollerCluster',
  //   taskDefinition: 'hslpollerTaskDefinition',
  //   count: 1,
  //   launchType: 'FARGATE',
  //   networkConfiguration: {
  //     awsvpcConfiguration: {
  //       subnets: ['subnet-052b0a2592195b3e1', 'subnet-00b48c7e2fdade5e6'],
  //       assignPublicIp: 'DISABLED',
  //       securityGroups: [],
  //     },
  //   },
  // };
  // try {
  //   ecs.runTask(params, (err) => {
  //     if (err) {
  //       console.log(`there was an error ${JSON.stringify(err)}`);
  //       return new createError.InternalServerError();
  //     }
  //     console.log('request was a success');
  //     fetch(requestUrl)
  //       .then((response) => {
  //         console.log(`we got a successful response from the server ${JSON.stringify(response)}`);
  //         const payload = response;
  //         return {
  //           statusCode: 200,
  //           body: `${JSON.stringify(payload)}`,
  //         };
  //       })
  //       .catch((error) => { throw new Error(error); }); // caught by the catch block
  //   });
  // } catch (error) {
  //   console.error(`error is ${error}`);
  //   return new createError.InternalServerError();
  // }
};

exports.startPolling = commonMiddleware(startPolling);
exports.getVehicleStatus = commonMiddleware(getVehicleStatus);
exports.requestTracker = commonMiddleware(requestTracker);
