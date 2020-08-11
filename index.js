import poll from './vehicle-status-poller';
import request from './vehicle-tracking-request';
import retreive from './vehicle-status-retrieve';
import commonMiddleware from './commonMiddleware';

const getVehicleStatus = async () => {
  const message = 'getVehicleStatus has been called';
  return {
    statusCode: 200,
    body: message,
  };
};

const startPolling = async () => {
  const message = 'startPolling has been called';
  return {
    statusCode: 200,
    body: message,
  };
};

const requestTracker = async () => {
  const message = 'requestTracker has been called';
  return {
    statusCode: 200,
    body: message,
  };
};

exports.getVehicleStatus = getVehicleStatus;
exports.startPolling = startPolling;
exports.requestTracker = requestTracker;
