var path = require('path');

// default = local development

module.exports = {
  api: {
    baseUrl: 'http://api.storypalette.net/v1/',
  },
  server: {
    environment: 'production',
    port: 8890,
  }
};