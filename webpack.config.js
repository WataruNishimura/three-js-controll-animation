const path = require('path');
const Fiber = require("fibers");

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'app', 'index'),
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/js/',
    filename: "bundle.js",
    chunkFilename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.s[ac]ss$/i,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "sass-loader",
          options: {
            implementation: require('sass'),
            sassOptions: {
              fiber: Fiber
            }
          }
        }
      ]
    }]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx']
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: 'localhost',
    port: 8080,
    hot: true,
    watchContentBase: true,
    open: true
  }
};