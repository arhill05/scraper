const path = require('path');
const outputDirectory = path.resolve(__dirname, 'dist');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = options => {
  return {
    entry: './client/App.js',
    mode: 'development',
    output: {
      path: outputDirectory,
      filename: 'bundle.js'
    },
    module: {
      rules: [{
        test: /.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }]
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }]
    },
    devServer: {
      contentBase: outputDirectory,
      proxy: {
        '/api': 'http://localhost:3031'
      }
    },
    plugins: [
      new CleanWebpackPlugin([outputDirectory]),
      new HtmlWebpackPlugin({
        template: './public/index.html'
        //favicon: './public/favicon.ico'
      })
    ]
  };
};