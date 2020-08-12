/* eslint-disable */
const mqtt = require('mqtt');
const createError = require('http-errors');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

module.exports = function poll(id) {
  const config = new AWS.Config({
    accessKeyId: process.env.awsAccessKeyId,
    secretAccessKey: process.env.awsSecretAccessKey,
    region: process.env.awsDefaultRegion
  });

  AWS.config.update(config);

  const dynamo = new AWS.DynamoDB.DocumentClient();

  const client = mqtt.connect('mqtt://mqtt.hsl.fi:1883/');

  client.on('message', async (topic, message, packet) => {
    console.log('received message >>>>>>>>>>>>>>>>>');
    const {
      veh, tst, lat, long, dl,
    } = JSON.parse(message).VP;

    const data = {
      id: uuidv4(),
      veh, long, lat, tst, dl,
    };

    const params = {
      TableName: `Transit-Table-${process.env.environment}`,
      Item: data,
    };

    dynamo.put(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log('saved records to dynamo');
      }
    });
  });


  client.on('connect', () => {
    console.log(`connected to the mqtt broker ${client.connected}`);
  });

  client.on('error', () => {
    console.log('there was an error');
    client.end();
    throw new createError.InternalServerError(`There was a problem  trying to poll vehicle with id ${id}`);
  });

  const vehicleId = id;
  // const options = `/hfp/v2/journey/ongoing/vp/bus/+/+/${vehicleId}/+/+/+/+/3/#`;
  const options = `/hfp/v2/journey/ongoing/vp/bus/+/+/+/+/+/+/+/3/#`;

  client.subscribe(options);
};

// const params = {
//   prefix: 'hfp',
//   version: 'v2',
//   journey_type: 'journey',
//   temporal_type: 'ongoing',
//   event_type: 'vp',
//   transport_mode: '+',
//   operator_id: '+',
//   vehicle_number: vehicleId,
//   router_id: '+',
//   direction_id: '+',
//   headsign: '+',
//   start_time: '+',
//   next_stop: '+',
//   geohash_level: '3',
//   geohash: '+',
//   sid: '+',
// };
