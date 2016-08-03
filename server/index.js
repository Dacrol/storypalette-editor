// Storypalette Editor fix

var config = require('./config');
var path = require('path');
var express = require('express');
//var favicon = require('serve-favicon');
var morgan = require('morgan');

var app = express();
var env  = require('./env')(config);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));
///app.use(favicon(path.join(config.player.folder, '/assets/favicon.ico')));

app.get('/env.js', env);

app.get('/ping', function(req, res) {
  res.status(200).send('pong');
});

// Routing.
app.get('/*', function(req, res) {
  res.sendfile(path.join(__dirname, 'index.html'));
});

// Start server.
var port = process.env.PORT || config.port;
const mode = process.env.NODE_ENV;

app.listen(port, function() {
  console.log(`storypalette-editor-fix in ${mode} mode at port ${port}`);
});
