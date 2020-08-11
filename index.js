import createError from 'http-errors';
import poll from './vehicle-status-poller/index';
// import request from './vehicle-tracking-request';
// import retreive from './vehicle-status-retrieve';
import commonMiddleware from './commonMiddleware';

const getVehicleStatus = async () => {
  const message = 'getVehicleStatus has been called';
  return {
    statusCode: 200,
    body: message,
  };
};

const startPolling = async (id) => poll(id);

const requestTracker = async (event) => {
  const { id } = event.pathParameters;
  let params;
  try {
    params = startPolling(id);
  } catch (error) {
    console.error(`error is ${error}`);
    throw new createError.InternalServerError('an error has occurred processing that request');
  }
  return {
    statusCode: 200,
    body: `${JSON.stringify(params)}`,
  };
};

exports.startPolling = startPolling;
exports.getVehicleStatus = commonMiddleware(getVehicleStatus);
exports.requestTracker = commonMiddleware(requestTracker);
