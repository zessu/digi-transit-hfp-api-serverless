/* eslint-disable */

var queue = require('./queue');
var express = require('express');
var bodyParser = require('body-parser');
var createError = require('http-errors')

var app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log('run the / endpoint');
  res.send('running in fargate !')
});

// start polling api
app.get('/request', (req, res) => {
  const id = req.body.id;
  queue(id)
    .then(message => {
      res.send(message);
    })
    .catch(error => {
      return new createError.InternalServerError(error);
    });
});

app.get('/response', (req, res) => {
  res.send('success running /response');
});

app.listen(8080);
console.log('server is running at port 8080');
