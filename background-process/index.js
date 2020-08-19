/* eslint-disable */

var queue = require('./queue');
var express = require('express');
var bodyParser = require('body-parser');
var createError = require('http-errors')

var app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log('run the / endpoint');
  res.send('running in fargate yay!')
});

// start polling api
app.get('/request/:id', (req, res) => {
  console.log('you have reached this point');
  const id = req.params.id;
  if (!id) {
    console.log('was not valid, returning error');
    return new createError.BadRequest('Id parameter is required');
  }
  console.log('stuff was valid');
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

app.listen(80);
// console.log('server is running at port 80');
