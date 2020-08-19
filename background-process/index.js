/* eslint-disable */

var queue = require('./queue');
var express = require('express');
var bodyParser = require('body-parser');
var createError = require('http-errors')

var app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('running in fargate yay!')
});

// start polling api
app.get('/request/:id', (req, res) => {
  const id = req.params.id;
  if (!id) {
    return new createError.BadRequest('Id parameter is required');
  }
  queue(id)
    .then(message => {
      res.send(message);
    })
    .catch(error => {
      res.send(error);
      // return new createError.BadRequest(error);
    });
});

app.get('/response', (req, res) => {
  res.send('success running /response');
});

app.listen(80);
// console.log('server is running at port 80');
