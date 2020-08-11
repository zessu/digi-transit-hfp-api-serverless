import mqtt from 'mqtt';
import createError from 'http-errors';

const client = mqtt.connect('mqtt://mqtt.hsl.fi:1883/');

client.on('connect', () => {
  console.log('connected to the mqtt broker');
  process.exit(0);
});

client.on('error', () => {
  console.log('there was an error');
  throw new createError.InternalServerError(`There was a problem  trying to poll vehicle with id ${id}`);
});

client.on('message', ({ topic, message }) => {
  console.log(`received message ${JSON.parse(topic)}`);
  console.log(`received message ${JSON.parse(message)}`);
  process.exit(0);
});

const poll = (id) => {
  const vehicleId = id;
  const params = {
    prefix: 'hfp',
    version: 'v2',
    journey_type: 'journey',
    temporal_type: 'ongoing',
    event_type: 'vp',
    transport_mode: '+',
    operator_id: '+',
    vehicle_number: vehicleId,
    router_id: '+',
    direction_id: '+',
    headsign: '+',
    start_time: '+',
    next_stop: '+',
    geohash_level: '3',
    geohash: '+',
    sid: '+',
  };

  client.subscribe(params, {}, (val) => {
    console.log(JSON.parse(val));
  });
  return params;
};

export default poll;
