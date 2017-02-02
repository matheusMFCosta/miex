'use strict';

var path = require('path');
var proxy = require('proxy-middleware');
var url = require('url');
var express = require('express');

var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var config = require('../webpack/webpack.production.config');

var app = new express();
var port = 3000;

console.log('Environment: PRODUCTION');
var compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));

app.use('/proxy/iam-authorizer', proxy(url.parse('https://iam-authorizer.vtex.com')));
app.use('/proxy/identity-broker', proxy(url.parse('https://identity-broker.vtex.com')));
app.use('/proxy/identity-middleware', proxy(url.parse('https://identity-middleware.vtex.com')));

app.use('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info('==> Listening on port http://localhost:%s/ in your browser.', port);
  }
});
