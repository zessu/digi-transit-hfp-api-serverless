const { workerData, parentPort } = require('worker_threads');
const AWS = require('aws-sdk');
const mqtt = require('mqtt');
const { v4: uuidv4 } = require('uuid');

// TODO configure time outs for polling
// TODO when journey ends, set status on table correctly

const config = new AWS.Config({
  accessKeyId: process.env.awsAccessKeyId,
  secretAccessKey: process.env.awsSecretAccessKey,
  region: process.env.awsDefaultRegion,
});

AWS.config.update(config);

const vehicleId = workerData;

const dynamo = new AWS.DynamoDB.DocumentClient();

// look for existing record of vehicle and don't track if that is the case

dynamo.query({
  TableName: `Tracked-Vehicles-${process.env.environment}`,
  KeyConditionExpression: 'veh = :vehicleId',
  FilterExpression: 'status = :status',
  ExpressionAttributeValues: {
    ':vehicleId': vehicleId,
    ':status': 'active',
  },
})
  .promise()
  .then((data) => {
    const client = mqtt.connect('mqtt://mqtt.hsl.fi:1883/');

    client.on('message', async (topic, message) => {
      console.log('client received a message');
      const msgParams = {
        code: 0,
        message: `vehicle with id ${workerData}'s tracking commenced`,
      };
      parentPort.postMessage(msgParams);
      const {
        veh, tst, lat, long, dl, oper,
      } = JSON.parse(message).VP;

      const item = {
        id: veh,
        long,
        lat,
        tst,
        dl,
        oper,
      };

      const params = {
        TableName: `Transit-Table-${process.env.environment}`,
        Item: item,
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

    client.on('error', () => {
      client.end();
      process.exit(1); // exit worker process
    });

    // const options = `/hfp/v2/journey/ongoing/vp/bus/+/+/${vehicleId}/+/+/+/+/3/#`;
    const topic = `/hfp/v2/journey/ongoing/vp/+/+/${vehicleId}/+/+/+/+/+/3/#`;

    if (data.Count !== 0) {
      console.log('vehicle already being tracked');
      // item record exists in the database
      const msgParams = {
        code: 1,
        message: `Vehicle with id ${vehicleId} is already being tracked`,
      };
      parentPort.postMessage(msgParams);
      // throw new Error(`Vehicle with id ${vehicleId} is already being tracked`);
    } else {
      console.log('vehicle not being tracked');
      client.subscribe(topic, (err) => {
        if (err) {
          process.exit(1);
        } else {
          // save record being tracked
          const params = {
            TableName: `Tracked-Vehicles-${process.env.environment}`,
            Item: {
              id: uuidv4(),
              veh: vehicleId,
              status: 'active',
              time: Date.now(),
            },
          };
          dynamo.put(params).promise().catch((error) => console.log(`error ${error} saving to database`));
        }
      });
    }
  })
  .catch((error) => console.log(`dynamo returned error ${error} trying to fetch resource`));
