const productionConfig = {
  //apiBase: 'http://api.storypalette.net/v1/',
  //socketBase: 'http://api.storypalette.net/',
  apiBase: 'http://server.storypalette.se/v1/',
  environment: 'production',
  port: 8883,
};

const developmentConfig = {
  apiBase: 'http://localhost:8880/v1/',
  environment: 'local',
  port: 8883,
}

const config = (process.env.NODE_ENV === 'development') ? developmentConfig : productionConfig;

module.exports = config;
