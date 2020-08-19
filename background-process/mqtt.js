const { workerData, parentPort } = require('worker_threads');
const AWS = require('aws-sdk');
const mqtt = require('mqtt');
const { v4: uuidv4 } = require('uuid');

//TODO configure time outs for polling

const config = new AWS.Config({
  accessKeyId: process.env.awsAccessKeyId,
  secretAccessKey: process.env.awsSecretAccessKey,
  region: process.env.awsDefaultRegion,
});

AWS.config.update(config);

const dynamo = new AWS.DynamoDB.DocumentClient();

const client = mqtt.connect('mqtt://mqtt.hsl.fi:1883/');

client.on('message', async (topic, message, packet) => {
  parentPort.postMessage(`vehicle with id ${workerData}'s tracking commenced`);

  console.log('received msg ->>>>>>>>>>>>>>>>>');
  const {
    veh, tst, lat, long, dl, oper,
  } = JSON.parse(message).VP;

  const data = {
    id: uuidv4(),
    veh,
    long,
    lat,
    tst,
    dl,
    oper,
  };

  const params = {
    TableName: `Transit-Table-${process.env.environment}`,
    Item: data,
  };

  dynamo.put(params, (err) => {
    if (err) {
      // do nothing, wait for next saving iteration
      console.log(`dynamo error : ${err}`);
    } else {
      console.log('saved records to dynamo');
    }
  });
});

client.on('connect', () => {
  console.log(`connected to the mqtt broker ${client.connected}`);
});

client.on('error', (error) => {
  console.log(`${error}`);
  client.end();
  process.exit(1); // exit worker process
});

const vehicleId = workerData;
// const options = `/hfp/v2/journey/ongoing/vp/bus/+/+/${vehicleId}/+/+/+/+/3/#`;
const topic = `/hfp/v2/journey/ongoing/vp/+/+/${vehicleId}/+/+/+/+/+/3/#`;

console.log(topic);

client.subscribe(topic, (err, granted) => {
  if (err) {
    console.log('there was an error executing this request');
    process.exit(1);
  } else {
    console.log(`tracking started ${JSON.stringify(granted)}`);
  }
});
