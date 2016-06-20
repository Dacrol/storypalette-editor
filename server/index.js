'use strict';

var config    = require('config');
var path      = require('path');
var express   = require('express');
var favicon   = require('serve-favicon');
var logger    = require('morgan');
var app       = express();
var server    = require('http').Server(app);
var env       = require('./env')(config);

//global.io = require('socket.io')(server);

// Configuration.
app.use(express.static(config.editor.folder));
app.use(favicon(path.join(config.editor.folder, './static/favicon.ico')));

app.get('/env.js', env);

// Routing.
app.all('/*', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

module.exports = app;

// Start server.
var port = process.env.PORT || config.server.port;
server.listen(port, function() {
  console.log("Server listening on: http://localhost:%s", port);
});