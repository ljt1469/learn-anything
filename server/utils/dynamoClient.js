const AWS = require('aws-sdk');


let dynamodb;

if (process.env.NODE_ENV === 'production') {
  // If on production get the credentials from the environment.
  AWS.config.update({
    region: 'us-west-1',
    accessKeyId: process.env.ELASTIC_DYNAMO_KEY_ID,
    secretAccessKey: process.env.ELASTIC_DYNAMO_SECRET_ACCESS_KEY,
  });

  dynamodb = new AWS.DynamoDB();
} else {
  // If on development environment, set some fake credentials.
  AWS.config.update({
    region: 'us-west-1',
    accessKeyId: 'fakeAccessKeyId',
    secretAccessKey: 'fakeSecretAccessKey',
  });

  // And specify the local endpoint for DynamoDB.
  dynamodb = new AWS.DynamoDB({
    endpoint: new AWS.Endpoint('http://localhost:8000'),
  });
}

const docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });


// This function allows to use DynamoDB methods as promises.
// Example use:
//
// dynamo('get', { ...params })
//   .then(data => console.log(data))
//   .catch(err => console.error('something bad happened', err));
module.exports = (method, params) =>
  new Promise((resolve, reject) => {
    docClient[method](params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
