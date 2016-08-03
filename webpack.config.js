var path = require('path');

var ngTemplateLoader = (
  'ngtemplate?relativeTo=' + path.resolve(__dirname, './src/') +
  '!html'
);

module.exports = {
  entry: './src/app.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },
    {
      test: /\.html$/,
      loader: ngTemplateLoader
    },
    {
      test: /\.less$/,
      loader: "style!css!less"
    },
    {
      test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      loader : 'file-loader'
    }]
  }
};
