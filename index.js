import axios from 'axios';
import commonMiddleware from './commonMiddleware';
import createHttpError from 'http-errors';

const getVehicleLocation = async () => ({
  statusCode: 200,
  body: 'some random string here',
});

const requestTracker = async (event, context, callback) => {
  const { id } = event.pathParameters;
  console.log(`supplied id is ${id}`);
  // TODO use env vars
  const gatewayResource = 'http://hslpollerLoadBalancer-1683342120.eu-west-1.elb.amazonaws.com';
  const options = {
    method: 'post',
    url: `${gatewayResource}/request/${id}`,
    port: 80,
  };
  await axios(options).then((success) => {
    console.log(`axios got a success message: ${success}`);
    callback(success);
  }).catch((error) => {
    throw new createHttpError.BadRequest(error);
  });
};

exports.getVehicleStatus = commonMiddleware(getVehicleLocation);
exports.requestTracker = commonMiddleware(requestTracker);
