var config = require('./config');
var path  = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');

var app = express();
var env  = require('./env')(config);

// Logging
app.use(morgan('dev'));

// Serve static files
const publicFolder = path.resolve(__dirname, '../public');
app.use(express.static(publicFolder));
//app.use(favicon(path.join(config.performer.folder, './static/favicon.ico')));

// Routing.
app.get('/env.js', env);
app.all('/*', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Start server.
const port = process.env.PORT || config.port;
const mode = process.env.NODE_ENV;

app.listen(port, function() {
  console.log(`storypalette-editor in ${mode} mode at port ${port}`);
});
