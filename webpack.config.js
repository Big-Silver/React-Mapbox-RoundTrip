// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CONFIG = {
  mode: 'development',

  entry: {
    app: resolve('./app.js')
  },

  output: {
    library: ['App']
  },

  module: {
    rules: [
      {
        // Compile ES2015 using buble
        test: /\.js$/,
        loader: 'buble-loader',
        include: [resolve('.')],
        exclude: [/node_modules/],
        options: {
          objectAssign: 'Object.assign'
        }
      }
    ]
  },

  resolve: {
    alias: {
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new HtmlWebpackPlugin({template: './index.html'}),
    new webpack.EnvironmentPlugin(['MapboxAccessToken'])
  ]
};

// This line enables bundling against src in this repo rather than installed module
module.exports = env => (env ? require('../../webpack.config.local')(CONFIG)(env) : CONFIG);
