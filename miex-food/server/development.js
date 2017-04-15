
'use strict'

var init = require('../app/init'); 
var path = require('path');
const request = require('request')
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/*', function(req, res) {
  //console.log(req.body.entry[0].messaging[0])
  //const challenge = req.query['hub.challenge']
  // const messaging = req.body.entry[0].messaging[0];
  // const senderId = messaging.sender.id
  // const recipient = messaging.recipient.id
  // const timestamp = messaging.timestamp
  // const messageText = messaging.message.text

  init(res,req)

  //res.status(200).send(req.query['hub.challenge']);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

