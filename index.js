import http from 'http';
import commonMiddleware from './commonMiddleware';

const getVehicleLocation = async () => ({
  statusCode: 200,
  body: 'some random string here',
});

const requestTracker = async (event) => {
  const { id } = event.pathParameters;
  console.log(`supplied id is ${id}`);
  // TODO use env vars
  const gatewayResource = 'http://hslpollerLoadBalancer-1683342120.eu-west-1.elb.amazonaws.com';
  const requestUrl = `${gatewayResource}/request/${id}`;
  console.log(`request url ${requestUrl}`);
  return new Promise((resolve, reject) => {
    const options = {
      host: 'hslpollerLoadBalancer-1683342120.eu-west-1.elb.amazonaws.com',
      path: `/request/${id}`,
      port: 80,
      method: 'GET',
    };
    const req = http.request(options, (res) => {
      resolve('Success');
    });
    req.on('error', (e) => {
      reject(e.message);
    });
    // send the request
    req.end();
  });
};

exports.getVehicleStatus = commonMiddleware(getVehicleLocation);
exports.requestTracker = commonMiddleware(requestTracker);
