import mqtt from 'mqtt';
import createError from 'http-errors';

const poll = (id) => {
  const client = mqtt.connect('mqtt://mqtt.hsl.fi:1883/');

  client.on('message', ({ topic, message, packed }) => {
    console.log(`received message ${JSON.parse(topic)}`);
    console.log(`received message ${JSON.parse(message)}`);
  });

  client.on('connect', () => {
    console.log('connected to the mqtt broker :' + client.connected);
  });

  client.on('error', () => {
    console.log('there was an error');
    client.end();
    throw new createError.InternalServerError(`There was a problem  trying to poll vehicle with id ${id}`);
  });

  const vehicleId = id;
  // const options = `/hfp/v2/journey/ongoing/vp/bus/+/+/${vehicleId}/+/+/+/+/3/#`;
  const options = `/hfp/v2/journey/ongoing/vp/bus/+/+/+/+/+/+/+/+/#`;

  client.subscribe(options);

  setInterval(() => { console.log('processing........'); }, 5000);
};

export default poll;

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
