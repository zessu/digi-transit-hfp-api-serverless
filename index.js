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

const startPolling = async (event) => {
  const { vehicleId } = event.body;
  poll(vehicleId);
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

exports.getVehicleStatus = commonMiddleware(getVehicleStatus);
exports.startPolling = commonMiddleware(startPolling);
exports.requestTracker = commonMiddleware(requestTracker);
