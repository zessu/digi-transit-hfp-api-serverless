const { Worker } = require('worker_threads');

module.exports = function queue(workerData) {
  const wk = new Worker(
    './mqtt.js', { workerData },
  );
  return new Promise((resolve, reject) => {
    wk.on('message', resolve);
    wk.on('error', reject);
    wk.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error('stopped tracking vehicle'));
      }
    });
  });
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
