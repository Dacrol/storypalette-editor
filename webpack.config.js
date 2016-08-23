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
  resolve: { fallback: path.join(__dirname, "node_modules") },
  resolveLoader: { fallback: path.join(__dirname, "node_modules") },
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
      loader: 'file?name=/assets/fonts/[name].[ext]'
    },
    {
      test: /\.(png|jpg|gif)$/,
      loader: "file?name=/assets/img/[name].[ext]"
    },
    {
        test: /\.(ico)$/,
        loader: "file?name=/[name].[ext]"
    }]
  }
};
