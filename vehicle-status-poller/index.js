import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://mqtt.hsl.fi:1883/');

const startPolling = async (vehicleId) => {
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
    geohash_level: '0',
    geohash: '+',
    sid: '+',
  };

  client.subscribe(params, {}, (val) => {
    console.log(JSON.parse(val));
  });

  client.on('connect', () => {
    console.log('logged something');
  });

  client.on('error', () => { console.log('there was an error'); });

  client.on('message', ({ topic, message }) => {
    console.log(`received message ${JSON.parse(topic)}`);
    console.log(`received message ${JSON.parse(message)}`);
  });
};

exports.startPolling = startPolling;
