var path = require('path');

// default = local development

module.exports = {
  api: {
    baseUrl: 'http://api.storypalette.net/v1/',
  },
  server: {
    environment: 'local',
    port: 8888,
    resources: path.resolve(__dirname, '../resources'), 
    cache: path.resolve(__dirname, '../cache'),
  },
  editor: {
    folder: path.resolve(__dirname, '../public'), 
  },
};