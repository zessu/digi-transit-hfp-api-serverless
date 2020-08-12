/* eslint-disable */

var http = require('http');
var aws = require('aws-sdk');
var poll = require('./poll-function');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('done')
});

// start polling api
app.get('/request', (req, res) => {
  id = req.id;
  poll(id);
});

app.get('/response', (req, res) => { });

app.listen(8080);
console.log('Node.js web server at port 8080 is running..');
