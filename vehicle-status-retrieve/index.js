import { AWS } from 'aws-sdk';
import createError from 'http-errors';

const ecs = new AWS.ECS();

exports.getVehicleStatus = async (event) => {
  const { id } = event.pathParameters;
  const gatewayResource = 'hslpollerLoadBalancer-1683342120.eu-west-1.elb.amazonaws.com';
  const requestUrl = `${gatewayResource}/request/${id}`;
  const params = {
    cluster: 'hslpollerCluster',
    count: 1,
    taskDefinition: 'hslpollerTaskDefinition',
  };
  try {
    ecs.runTask(params, (err) => {
      if (err) {
        return new createError.InternalServerError('there was a problem starting the task');
      }
      return fetch(requestUrl)
        .then((response) => {
          const payload = response;
          return {
            statusCode: 200,
            body: `${JSON.stringify(payload)}`,
          };
        })
        .catch((error) => { throw new Error(error); }); // caught by the catch block
    });
  } catch (error) {
    console.error(`error is ${error}`);
    throw new createError.InternalServerError('an error has occurred processing that request');
  }
};
