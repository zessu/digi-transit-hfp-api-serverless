const path = require('path');

module.exports = {
  mode: 'production',
  entry: './index.js',
  target: 'node',
  // externals: [nodeExternals()],
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js', // this should match the first part of function handler in serverless.yml
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: ['babel-loader'],
      },
    ],
  },
};
